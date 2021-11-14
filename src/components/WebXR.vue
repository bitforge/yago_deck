<template>
    <div class="webxr">
        <canvas ref="glcanvas" class="glcanvas"></canvas>
        <slot></slot>
    </div>
</template>

<script lang="ts">
// Typescript and WebXR unfortunately are not in a love relation yet
// Disabling checks is required to build this project, but missing out on all benefits of ts :(

// When you feel brave: try to find or create a good WebXR type definition
// If you fail to make it work, please increase this counter:
// FAILED_ATTEMPTS_TO_MARRY_TYPESCRIPT_AND_WEBXR = 2

// @ts-nocheck

import { Component, Vue, Watch } from 'vue-property-decorator';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Messages } from '@/messages';
import { Model } from '@/api';
import * as THREE from 'three';
import { Actions } from '@/store';

@Component
export default class WebXr extends Vue {
    // Current model
    private selectedModel: Model | null = null;

    // WebXR & WebGL:
    private session: XRSession | null = null;
    private xrLightProbe: XRLightEstimate | null = null;
    private referenceSpace: XRReferenceSpace | null = null;
    private hitTestSource: XRHitTestSource | null = null;
    private gl: WebGLRenderingContext | null = null;

    // THREE.js
    private renderer: THREE.WebGLRenderer | null = null;
    private models3D: { [id: string]: THREE.Group } = {};
    private gltfLoader = new GLTFLoader();
    private nopsy: THREE.Group | null = null;
    private previewModel: THREE.Object3D | null = null;
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera();
    private directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    private lightProbe = new THREE.LightProbe();
    private previewMaterial: THREE.MeshStandardMaterial | null = null;

    public mounted(): void {
        // Prepare THREE.js Scene
        this.initCamera();
        this.addLightning();
        this.loadNopsy();

        // Subscribe to events
        this.$root.$on(Messages.LAUNCH_XR, this.onLaunchXR);
        this.$root.$on(Messages.MODEL_PLACE, this.placeModel);
        this.$root.$on(Messages.MODEL_UNDO, this.removeLastModel);
        this.$root.$on(Messages.MODEL_CLEAR, this.removeAllModels);
        this.$root.$on(Messages.MODEL_SELECT, this.updateSelectedModelId);
    }

    public beforeDestroy(): void {
        // Unsubscribe from events
        this.$root.$off(Messages.LAUNCH_XR, this.onLaunchXR);
        this.$root.$off(Messages.MODEL_PLACE, this.placeModel);
        this.$root.$off(Messages.MODEL_UNDO, this.removeLastModel);
        this.$root.$off(Messages.MODEL_CLEAR, this.removeAllModels);
        this.$root.$off(Messages.MODEL_SELECT, this.updateSelectedModelId);
    }

    private initCamera(): void {
        this.camera.matrixAutoUpdate = false;
    }

    private addLightning(): void {
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
            this.scene.add(this.nopsy);
        });
    }

    @Watch('$store.state.models')
    public onModelsLoaded(): void {
        // setting first model as selected
        const models = this.$store.state.models as Model[];
        this.updateSelectedModelId(models[0].id);
    }

    private updateSelectedModelId(modelId: string): void {
        // Load models on demand
        this.selectedModel = this.$store.getters.getModelById(modelId) as Model;
        if (!this.models3D[this.selectedModel.id]) {
            this.loadModel(this.selectedModel);
        }
    }

    private loadModel(model: Model): void {
        if (!model || !model.glb) throw 'Cloud not find model infos for ' + model;
        this.gltfLoader.load(model.glb, gltf => {
            const object3D = gltf.scene;
            object3D.name = `model-${model.id}`;
            this.models3D[model.id] = object3D;
        });
    }

    public placeModel(modelId: string): void {
        if (!this.nopsy) return;
        if (this.models3D[modelId]) {
            const clone = this.models3D[modelId].clone();
            clone.position.copy(this.nopsy.position);
            this.scene.add(clone);
        }
    }

    public removeLastModel(): void {
        const lastModel = this.scene.children.at(-1) as THREE.Object3D;
        if (lastModel && lastModel.name.startsWith('model')) {
            this.scene.remove(lastModel);
        }
    }

    public removeAllModels(): void {
        const children = this.scene.children.slice().reverse();
        for (const child of children) {
            if (child.name.startsWith('model')) {
                this.scene.remove(child);
            }
        }
    }

    public async onLaunchXR(): Promise<void> {
        // Create WebGL rendering context
        const canvas = this.$refs.glcanvas as any;
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
        this.$store.commit(Actions.SetXRActive, true);
    }

    private onXRFrame(time: number, frame: XRFrame): void {
        // Queue up the next draw request.
        if (!this.session) return;
        this.session.requestAnimationFrame(this.onXRFrame);

        // Bail out right away if required stuff is not available
        if (!this.renderer || !this.session.renderState.baseLayer || !this.gl) return;

        // Update Lightning estimate for current frame
        this.updateLightningEstimate(frame);

        // Bind the graphics framebuffer to the baseLayer's framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.renderState.baseLayer.framebuffer);

        // Retrieve the pose of the device.
        // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
        const pose = frame.getViewerPose(this.referenceSpace);
        if (pose) {
            // In mobile AR, we only have one view.
            const view = pose.views[0];
            const viewport = this.session.renderState.baseLayer.getViewport(view);
            this.renderer.setSize(viewport.width, viewport.height);

            // Use the view's transform matrix and projection matrix to configure the THREE.camera.
            this.camera.matrix.fromArray(view.transform.matrix);
            this.camera.projectionMatrix.fromArray(view.projectionMatrix);
            this.camera.updateMatrixWorld(true);

            // Update cursor and preview model in active mode
            const hitTestEnabled = !this.$store.state.viewOnlyMode;
            if (hitTestEnabled) {
                this.runHitTestAndUpdateCursor(frame);
            } else {
                this.nopsy.visible = false;
            }

            // Render the scene with THREE.WebGLRenderer.
            this.renderer.render(this.scene, this.camera);
        }
    }

    private onSessionEnded(): void {
        // Free resources
        this.renderer?.dispose();
        this.$store.commit(Actions.SetXRActive, false);
    }

    private runHitTestAndUpdateCursor(frame: XRFrame) {
        // Check if viewport center has a hit test and update nopsy position
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);
        if (hitTestResults.length > 0 && this.nopsy) {
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
        // Nopsy is absolutely required!
        if (!this.nopsy || !this.selectedModel) return;
        const isSelectedModel = this.previewModel?.name == `model-${this.selectedModel?.id}`;

        // Remove preview when it's not the current model
        if (this.previewModel && !isSelectedModel) {
            this.nopsy.remove(this.previewModel);
            this.previewModel = null;
        }

        // Add preview model when loaded
        const addPreviewModel = !isSelectedModel && this.models3D[this.selectedModel?.id];
        if (addPreviewModel) {
            // Add new semi transparent clone
            this.previewModel = this.models3D[this.selectedModel.id].clone();
            this.previewModel.traverse((object: THREE.Object3D<THREE.Event>) => {
                const mesh = object as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (material) mesh.material = this.getPreviewMaterial();
            });
            this.nopsy.add(this.previewModel);
        }
    }

    private getPreviewMaterial(): THREE.MeshStandardMaterial {
        // Only create once
        if (this.previewMaterial) return this.previewMaterial;

        // Create and keep preview material
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
        return this.previewMaterial;
    }

    private updateLightningEstimate(frame: XRFrame): void {
        // Get light estimate from XRFrame
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
