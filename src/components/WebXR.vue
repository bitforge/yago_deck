<template>
    <div class="webxr">
        <canvas ref="glcanvas" class="glcanvas"></canvas>
        <div class="domOverlay" ref="domOverlay">
            <div class="toolbar" v-if="xrSessionActive">
                <button @click="removeLastModel">
                    <img src="~@/assets/img/undo.svg" />
                    <span>Undo</span>
                </button>
                <button @click="removeAllModels">
                    <img src="~@/assets/img/delete.svg" />
                    <span>Clear</span>
                </button>
            </div>
            <div class="touch" ref="touch" @click="placeModel" v-if="xrSessionActive">
                <p>Tap anywhere to place!</p>
            </div>
            <div class="slider" ref="slider">
                <div class="slides">
                    <div v-for="(model, index) in models" :key="index" class="slide">
                        <button
                            v-if="model.id == selectedModelId"
                            class="slide selected"
                            :style="{ backgroundImage: 'url(' + model.image + ')' }"></button>
                        <button
                            v-else
                            class="slide"
                            :style="{ backgroundImage: 'url(' + model.image + ')' }"
                            @click="updateSelectedModelId(model.id)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// Typescript and WebXR unfortunately are not in a love relation yet
// Disabling all checks is required to build this project, but missing out on the benefits of ts
// Whenever a complete type declaration for WebXR is available, remove this line

// @ts-nocheck

import { Component, Vue } from 'vue-property-decorator';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EventBus, Messages } from '@/Messaging';
import * as THREE from 'three';

@Component
export default class WebXr extends Vue {
    private apiKey = 'Token bf51a81599630627c69dfb90561983627ef1e66f';
    // Using feey plants as demo project
    private projectId = '03d861a8-90fe-42bb-aeba-a4aead7917ea';
    // Models from Project (Genie Demo)
    private models: Model[] = [];
    // selected button/model
    private selectedModelId = '';
    // Toggles UI layer visiblity
    public xrSessionActive = false;

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

    public mounted(): void {
        EventBus.$on(Messages.MODELS_LOADED, this.onModelsLoaded);
        EventBus.$on(Messages.LAUNCH_XR_SESSION, this.onLaunchXR);
    }

    private onModelsLoaded() {
        this.models = this.$store.state.models;
        // setting first model as selected
        this.updateSelectedModelId(this.models[0].id);
        this.loadNopsy();
        this.addLightning();
        this.initCamera();
    }

    private updateSelectedModelId(modelId: string): void {
        this.selectedModelId = modelId;
        // Load models on demand
        if (!this.models3D[modelId]) {
            this.loadModel(modelId);
        }
    }

    private loadModel(modelId: string): void {
        const model = this.models.find(model => model.id === modelId);
        if (!model || !model.glb) throw 'Cloud not find model infos for ' + modelId;

        this.gltfLoader.load(model.glb, gltf => {
            const object3D = gltf.scene;
            object3D.name = `model-${model.id}`;
            this.models3D[model.id] = object3D;
        });
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

    private addLightning(): void {
        this.scene.add(this.directionalLight);
        this.scene.add(this.lightProbe);
    }

    private initCamera(): void {
        this.camera.matrixAutoUpdate = false;
    }

    public placeModel(): void {
        if (!this.nopsy) return;
        if (this.models3D[this.selectedModelId]) {
            const clone = this.models3D[this.selectedModelId].clone();
            clone.position.copy(this.nopsy.position);
            this.scene.add(clone);
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

    public removeLastModel(): void {
        const lastModel = this.scene.children.at(-1) as THREE.Object3D;
        if (lastModel && lastModel.name.startsWith('model')) {
            this.scene.remove(lastModel);
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
        this.session = await xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'light-estimation'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: this.$refs.domOverlay },
        });

        if (!this.session) {
            alert('Sorry, could not start WebXR session! :(');
            return;
        }

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
        this.xrSessionActive = true;
        this.$store.commit('setXRActive', true);
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

            // Check if viewport center has a hit test and update nopsy position
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);
            if (hitTestResults.length > 0 && this.nopsy) {
                const hitPose = hitTestResults[0].getPose(this.referenceSpace);
                if (hitPose) {
                    this.nopsy.visible = true;
                    const pos = hitPose.transform.position;
                    this.nopsy.position.set(pos.x, pos.y, pos.z);
                }

                // Update semi transparent preview model
                this.updatePreviewModel();

                this.nopsy.updateMatrixWorld(true);
            }

            // Render the scene with THREE.WebGLRenderer.
            this.renderer.render(this.scene, this.camera);
        }
    }

    private updatePreviewModel(): void {
        // Nopsy is absolutely required!
        if (!this.nopsy) return;

        // Update preview model when necessary
        const previewModelUpdateNeeded =
            this.selectedModelId &&
            this.models3D[this.selectedModelId] &&
            this.previewModel?.name != `model-${this.selectedModelId}`;

        if (previewModelUpdateNeeded) {
            // Remove old version when present
            if (this.previewModel) this.nopsy.remove(this.previewModel);
            // Add new semi transparent clone
            this.previewModel = this.models3D[this.selectedModelId].clone();
            this.previewModel.traverse((object: THREE.Object3D<THREE.Event>) => {
                const mesh = object as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (material) {
                    const transMat = material.clone();
                    transMat.format = THREE.RGBAFormat;
                    transMat.transparent = true;
                    transMat.opacity = 0.5;
                    transMat.side = THREE.DoubleSide;
                    mesh.material = transMat;
                }
            });
            this.nopsy.add(this.previewModel);
        }
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
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
}

.glcanvas {
    z-index: 1;
    transform: translateZ(0);
    pointer-events: none;
}

.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    position: absolute;
    bottom: 140px;
    left: 0;
    right: 0;

    padding-top: calc(env(safe-area-inset-top) + 10px);
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;

    z-index: 100;
}

.toolbar button {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    padding: 8px 16px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.toolButton img {
    width: 24px;
    height: 24px;
    padding: 4px;
}

.touch {
    top: 100px;
    left: 0;
    right: 0;
    bottom: 121px;
    position: absolute;
    z-index: 10;
}

.touch p {
    position: absolute;
    color: #fff;
    font-size: 12px;
    bottom: 10px;
    right: 0;
    left: 0;
}

.touch button:active {
    border: solid 2px #4285f4;
}

.slider {
    width: 100%;
    height: 120px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: env(safe-area-inset-bottom, 20px);
    text-align: center;
    overflow: hidden;
    z-index: 100;
}

.slides {
    position: absolute;
    left: 10px;
    right: 0;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    display: hide;
}

.slide {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #fff;
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: none;
    display: flex;
}

.slide.selected {
    border: 2px solid #4285f4;
}

.slide:focus {
    outline: none;
}

.slide:focus-visible {
    outline: 1px solid #4285f4;
}
</style>
