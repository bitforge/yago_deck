<template>
    <div class="webxr">
        <canvas ref="glcanvas" class="glcanvas"></canvas>
        <dom-overlay />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import DomOverlay from '@/components/DomOverlay.vue';
import { Events } from '@/events';
import { Model } from '@bitforgehq/genie-api-client';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from '@/stats';

@Component({
    components: {
        DomOverlay,
    },
})
export default class WebXr extends Vue {
    private state = getModule(GlobalState, this.$store);

    // Current model
    private selectedModel: Model | null = null;

    // THREE.js rendering layers:
    // 0: Cursor and preview objects
    // 1: Placed models
    // Camera and lights are enabled on all layers

    // WebXR & WebGL:
    private session: XRSession | undefined;
    private xrLightProbe: XRLightProbe | undefined;
    private referenceSpace: XRReferenceSpace | undefined;
    private hitTestSource: XRHitTestSource | undefined;
    private gl: WebGLRenderingContext | undefined;

    // THREE.js
    private renderer: THREE.WebGLRenderer | null = null;
    private models3D: { [id: string]: THREE.Group } = {};
    private gltfLoader = new GLTFLoader();
    private dracoLoader = new DRACOLoader();
    private nopsy = new THREE.Group();
    private previewModel: THREE.Object3D | null = null;
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera();
    private center = new THREE.Vector2(0, 0);
    private modelRaycaster = new THREE.Raycaster();
    private directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    private lightProbe = new THREE.LightProbe();
    private previewMaterial: THREE.MeshStandardMaterial | null = null;
    private stats = Stats();

    public mounted(): void {
        // Prepare THREE.js environment
        this.initCamera();
        this.addLights();
        this.loadNopsy();
        this.createPreviewMaterial();
        this.prepareDracoLoader();
        this.addStats();

        // Subscribe to events
        this.$root.$on(Events.LaunchXR, this.onLaunchXR);
        this.$root.$on(Events.EndXR, this.onEndXR);
        this.$root.$on(Events.SelectModel, this.onSelectModel);
        this.$root.$on(Events.PlaceModel, this.onPlaceModel);
        this.$root.$on(Events.UnplaceModel, this.onUnplaceModel);
        this.$root.$on(Events.ClearPlaced, this.onClearModels);
    }

    public beforeDestroy(): void {
        // Unsubscribe from events
        this.$root.$off(Events.LaunchXR, this.onLaunchXR);
        this.$root.$off(Events.EndXR, this.onEndXR);
        this.$root.$off(Events.SelectModel, this.onSelectModel);
        this.$root.$off(Events.PlaceModel, this.onPlaceModel);
        this.$root.$off(Events.UnplaceModel, this.onUnplaceModel);
        this.$root.$off(Events.ClearPlaced, this.onClearModels);
    }

    private initCamera(): void {
        this.camera.layers.enableAll();
        this.camera.matrixAutoUpdate = false;
        this.modelRaycaster.layers.set(1);
    }

    private addLights(): void {
        this.directionalLight.layers.enableAll();
        this.lightProbe.layers.enableAll();
        this.scene.add(this.directionalLight);
        this.scene.add(this.lightProbe);
    }

    private loadNopsy(): void {
        // Nopsy is the name of our aim cursor
        // The name was invented by Parki Banya Gang
        // The original model was built with TinkerCAD:
        // https://bit.ly/3C668ge
        this.gltfLoader.load('nopsy.glb', gltf => {
            this.nopsy = gltf.scene;
            this.nopsy.name = 'nopsy';
            this.nopsy.castShadow = false;
            this.nopsy.visible = false;
            this.nopsy.traverse(obj => obj.layers.set(0));
            this.scene.add(this.nopsy);
        });
    }

    private createPreviewMaterial(): void {
        // Semi transparent (ghost) material for models not placed yet
        const transMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.5,
        });
        transMat.format = THREE.RGBAFormat;
        transMat.transparent = true;
        transMat.opacity = 0.3;
        transMat.side = THREE.DoubleSide;
        this.previewMaterial = transMat;
    }

    private prepareDracoLoader(): void {
        this.dracoLoader.setDecoderPath('/draco/');
        this.dracoLoader.preload();
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }

    private addStats(): void {
        const domOverlay = document.querySelector('.render-stats');
        domOverlay?.appendChild(this.stats.dom);
    }

    @Watch('state.models')
    public onModelsLoaded(): void {
        // setting first model as selected
        const models = this.state.models as Model[];
        this.onSelectModel(models[0].id);
    }

    private onSelectModel(modelId: string): void {
        // Load models on demand
        const model = this.state.getModelById(modelId);
        if (model === undefined) return;
        this.selectedModel = model;
        const isLoaded = this.models3D[this.selectedModel.id];
        if (!isLoaded) {
            this.loadModel(this.selectedModel);
        }
    }

    private loadModel(model: Model): void {
        if (!model || !model.glb) throw 'Cloud not find model infos for ' + model;
        this.gltfLoader.load(model.glb, gltf => {
            const object3D = gltf.scene;
            object3D.name = `mdl-${model.slug}`;
            object3D.traverse(obj => (obj.userData = model));
            this.models3D[model.id] = object3D;
        });
    }

    public onPlaceModel(modelId: string): void {
        if (this.models3D[modelId]) {
            // Create copy of 3D model and API model data
            const placedModel = this.models3D[modelId].clone();
            // Set position to current cursor
            placedModel.position.copy(this.nopsy.position);
            // Set layer for model and all children
            placedModel.traverse(obj => obj.layers.set(1));
            // Add clone to scene
            this.scene.add(placedModel);

            // Append placed model to state
            const model = placedModel.userData as Model;
            const modelClone = { ...model };
            modelClone.number = placedModel.id;
            placedModel.traverse(obj => (obj.userData = modelClone));
            this.state.placeModel(modelClone);

            // Instantly hide placing cursor
            this.nopsy.scale.setScalar(0);
        }
    }

    public onUnplaceModel(object: THREE.Object3D): void {
        // Find model root object
        while (object.parent && !object.name.startsWith('mdl')) {
            object = object.parent;
        }

        // Remove object from scene and placed models
        const model = object.userData as Model;
        this.state.unplaceModel(model);
        this.scene.remove(object);
    }

    public onClearModels(): void {
        const children = this.scene.children.slice().reverse();
        for (const child of children) {
            if (child.name.startsWith('model')) {
                this.scene.remove(child);
            }
        }
    }

    private onSessionEnded(): void {
        // Free up resources
        this.renderer?.dispose();
        this.state.setXRActive(false);
    }

    private onEndXR(): void {
        this.session?.end();
    }

    /** Initiates WebXR session and THREE.js rendering contenxt */
    public async onLaunchXR(): Promise<void> {
        // Create WebGL rendering context
        const canvas = this.$refs.glcanvas as HTMLCanvasElement;
        this.gl = canvas.getContext('webgl', {
            xrCompatible: true,
        }) as WebGLRenderingContext;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
            canvas: canvas,
            context: this.gl,
        });
        this.renderer.autoClear = false;

        // Session
        const xr = (navigator as any).xr;
        const domOverlay = document.querySelector('.domOverlay');
        this.session = await xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'light-estimation'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: domOverlay },
        });

        if (!this.session) {
            alert('Sorry, could not start WebXR session! :(');
            return;
        }

        this.session.onend = this.onSessionEnded;
        this.session.updateRenderState({
            baseLayer: new XRWebGLLayer(this.session, this.gl),
        });

        const viewerSpace = await this.session.requestReferenceSpace('viewer');
        this.referenceSpace = await this.session.requestReferenceSpace('local');
        this.hitTestSource = await this.session.requestHitTestSource({
            space: viewerSpace,
        });

        // Create XR Light Probe
        this.xrLightProbe = await this.session.requestLightProbe();

        // Create a render loop that allows us to draw on the AR view.
        this.session.requestAnimationFrame(this.onXRFrame);

        // Show DOM overlay once XR Session is active
        this.state.setXRActive(true);
    }

    /**
     * Main WebXR rendering loop
     * @param {DOMHighResTimeStamp} time - Current time offset since last frame
     * @param {XRFrame} frame - Current frame with all object tracked by session
     */
    private onXRFrame(time: DOMHighResTimeStamp, frame: XRFrame): void {
        // Bail out if required stuff is not available
        if (!this.session) return;
        if (!this.renderer || !this.session.renderState.baseLayer || !this.gl) return;

        // Queue up the next draw request.
        this.session.requestAnimationFrame(this.onXRFrame);

        // Bind the graphics framebuffer to the baseLayer's framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.renderState.baseLayer.framebuffer);

        // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
        const pose = frame.getViewerPose(this.referenceSpace);
        if (pose) {
            // Update scene for current position
            this.updateViewerPose(frame, pose);

            // Check if camera center hits a detected plane & update cursor
            if (!this.state.viewOnlyMode) {
                this.runHitTestAndUpdateCursor(frame);
            } else {
                this.nopsy.visible = false;
            }

            // Hide plane detection instruction when cursor is visible
            if (!this.state.xrTracking && this.nopsy.visible) {
                this.state.setXRTracking(true);
            }

            // Show inital tracking established message
            if (!this.state.xrTrackingEstablished && this.nopsy.visible) {
                this.state.setXRTrackingEstablished(true);
            }

            // Check if model is focused with Raycast form camera center
            this.updateFocusModel();

            // Update Light estimate for current frame
            this.updateLightEstimate(frame);

            // Render the scene
            this.renderer.render(this.scene, this.camera);

            // Update render stats
            this.stats.update();
        } else {
            // Show plane detection instructions (again)
            if (this.state.xrTracking) {
                this.state.setXRTracking(false);
            }
        }
    }

    private updateViewerPose(frame: XRFrame, pose: XRViewerPose): void {
        // Bail out if required stuff is not available
        if (!this.session) return;
        if (!this.renderer || !this.session.renderState.baseLayer || !this.gl) return;

        // In mobile AR, we only have one view.
        const view = pose.views[0];
        const viewport = this.session.renderState.baseLayer.getViewport(view);
        this.renderer.setSize(viewport.width, viewport.height);

        // Use the view's transform matrix and projection matrix to configure the THREE.camera.
        this.camera.matrix.fromArray(view.transform.matrix);
        this.camera.projectionMatrix.fromArray(view.projectionMatrix);
        this.camera.updateMatrixWorld(true);
    }

    private runHitTestAndUpdateCursor(frame: XRFrame) {
        // Check if viewport center has a hit test and update nopsy position
        if (!this.hitTestSource || !this.referenceSpace) return;

        const hitTestResults = frame.getHitTestResults(this.hitTestSource);
        if (hitTestResults.length > 0) {
            const hitPose = hitTestResults[0].getPose(this.referenceSpace);
            if (hitPose) {
                this.nopsy.visible = true;
                const pos = hitPose.transform.position;
                this.nopsy.position.set(pos.x, pos.y, pos.z);
            } else {
                this.nopsy.visible = false;
            }

            this.nopsy.updateMatrixWorld(true);

            // Update semi transparent preview model
            this.updatePreviewModel();
        }
    }

    private updatePreviewModel(): void {
        if (!this.selectedModel) return;
        const isSelectedModel = this.previewModel?.name == `mdl-${this.selectedModel.slug}`;

        // Remove preview when it's not the current model
        if (this.previewModel && !isSelectedModel) {
            this.nopsy.remove(this.previewModel);
            this.previewModel = null;
        }

        // Add preview model when require and model is loaded
        const addPreviewModel = !isSelectedModel && this.models3D[this.selectedModel?.id];
        if (addPreviewModel) {
            // Add new semi transparent clone
            this.previewModel = this.models3D[this.selectedModel.id].clone();
            this.previewModel.traverse(obj => obj.layers.set(0));
            this.previewModel.traverse((object: THREE.Object3D<THREE.Event>) => {
                const mesh = object as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (material && this.previewMaterial) {
                    mesh.material = this.previewMaterial;
                }
            });
            this.nopsy.add(this.previewModel);
        }
    }

    private updateFocusModel() {
        // Check if center of camera view hits a placed model
        // If so, hide cursor and preview model
        this.modelRaycaster.setFromCamera(this.center, this.camera);
        const modelHits = this.modelRaycaster.intersectObjects(this.scene.children, true);
        if (modelHits.length > 0) {
            // Update focused model
            const currentObject = modelHits[0].object;
            if (currentObject.id !== this.state.focused?.id) {
                this.state.setFocused(currentObject);
            }
            // Fade out cursor
            if (this.nopsy.scale.x > 0.01) {
                this.nopsy.scale.subScalar(0.1);
            }
        } else {
            // Unset focused model
            if (this.state.focused) {
                this.state.setFocused(null);
            }
            // Fade in cursor
            if (this.nopsy.scale.x < 0.99) {
                this.nopsy.scale.addScalar(0.1);
            }
        }
    }

    private updateLightEstimate(frame: XRFrame): void {
        // Get light estimate from XRFrame when possible
        if (!this.xrLightProbe) return;
        const lightEstimate = frame.getLightEstimate(this.xrLightProbe);
        if (!lightEstimate) return;

        // Calculate max light intensity
        const primary = lightEstimate.primaryLightIntensity;
        const maxLight = Math.max(primary.x, Math.max(primary.y, primary.z));
        const intensity = Math.max(1.0, maxLight);
        this.directionalLight.intensity = intensity;

        // Set directional light position and color
        const direction = lightEstimate.primaryLightDirection;
        this.directionalLight.position.set(direction.x, direction.y, direction.z);
        this.directionalLight.color.setRGB(primary.x / intensity, primary.y / intensity, primary.z / intensity);

        // Update light estimation harmonics
        this.lightProbe.sh.fromArray(lightEstimate.sphericalHarmonicsCoefficients);
    }
}
</script>

<style scoped>
.webxr {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
}

.glcanvas {
    pointer-events: none;
}
</style>
