// Typescript and WebXR unfortunately are not in a love relation yet
// Disabling all checks is required to build this project, but missing out on the benefits of ts
// Whenever a complete type declaration for WebXR is available, remove this line

// @ts-nocheck

import { Component, Vue } from 'vue-property-decorator';
import { Configuration, Model, ModelsApi } from '@/api';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene, DirectionalLight, LightProbe, WebGLRenderer, PerspectiveCamera, Group } from 'three';

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

    // WebXR:
    private session: XRSession | null = null;
    private xrLightProbe: XRLightEstimate | null = null;
    private referenceSpace: XRReferenceSpace | null = null;
    private hitTestSource: XRHitTestSource | null = null;

    // THREE.js
    private gl: WebGLRenderingContext | null = null;
    private renderer: WebGLRenderer | null = null;
    private models3D: { [id: string]: Group } = {};
    private gltfLoader = new GLTFLoader();
    private reticle: Group | null = null;
    private scene = new Scene();
    private camera = new PerspectiveCamera();
    private directionalLight = new DirectionalLight(0xffffff, 1);
    private lightProbe = new LightProbe();

    private async mounted(): Promise<void> {
        try {
            const modelApi = new ModelsApi(new Configuration({ apiKey: this.apiKey }));
            this.models = await modelApi.modelsList({ project: this.projectId });
            // setting first model as selected
            this.updateSelectedModelId(this.models[0].id);
            this.loadReticle();
            this.addLightning();
            this.initCamera();
        } catch (error: any) {
            console.log(error);
        }
    }

    private updateSelectedModelId(modelId: string): void {
        this.selectedModelId = modelId;
    }

    private loadReticle(): void {
        this.gltfLoader.load('reticle.glb', gltf => {
            this.reticle = gltf.scene;
            this.reticle.visible = false;
            this.scene.add(this.reticle);
        });
    }

    private addLightning(): void {
        this.scene.add(this.directionalLight);
        this.scene.add(this.lightProbe);
    }

    private initCamera(): void {
        this.camera.matrixAutoUpdate = false;
    }

    private loadModelsObject3D(): void {
        for (const model of this.models) {
            if (!model.glb) continue;
            this.gltfLoader.load(model.glb, gltf => (this.models3D[model.id] = gltf.scene));
        }
    }

    private placeModel(): void {
        if (!this.reticle) return;
        if (this.models3D[this.selectedModelId]) {
            const clone = this.models3D[this.selectedModelId].clone();
            clone.position.copy(this.reticle.position);
            this.scene.add(clone);
        }
    }

    private removeAllModels(): void {
        while (this.scene.children.length >= 3) {
            this.scene.remove(this.scene.children[this.scene.children.length - 1]);
        }
    }

    private removeLastModel(): void {
        if (this.scene.children.length >= 3) {
            this.scene.remove(this.scene.children[this.scene.children.length - 1]);
        }
    }

    private async activateXR(): Promise<void> {
        // Create WebGL rendering context
        const canvas = this.$refs.glcanvas as any;
        this.gl = canvas.getContext('webgl', {
            xrCompatible: true,
        }) as WebGLRenderingContext;

        // Renderer
        this.renderer = new WebGLRenderer({
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

        // Load Genie models list
        this.loadModelsObject3D();

        // Create a render loop that allows us to draw on the AR view.
        this.session.requestAnimationFrame(this.onXRFrame);

        // Show DOM overlay once XR Session is active
        this.xrSessionActive = true;
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
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);
            if (hitTestResults.length > 0 && this.reticle) {
                const hitPose = hitTestResults[0].getPose(this.referenceSpace);
                if (hitPose) {
                    this.reticle.visible = true;
                    const pos = hitPose.transform.position;
                    this.reticle.position.set(pos.x, pos.y, pos.z);
                }
                this.reticle.updateMatrixWorld(true);
            }
            // Render the scene with THREE.WebGLRenderer.
            this.renderer.render(this.scene, this.camera);
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
