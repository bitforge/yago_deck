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
    private nopsy: Group | null = null;
    private scene = new Scene();
    private camera = new PerspectiveCamera();
    private directionalLight = new DirectionalLight(0xffffff, 1);
    private lightProbe = new LightProbe();

    public async mounted(): Promise<void> {
        try {
            const modelApi = new ModelsApi(new Configuration({ apiKey: this.apiKey }));
            this.models = await modelApi.modelsList({ project: this.projectId });
            // setting first model as selected
            this.updateSelectedModelId(this.models[0].id);
            this.loadNopsy();
            this.addLightning();
            this.initCamera();
        } catch (error: any) {
            console.log(error);
        }
    }

    private updateSelectedModelId(modelId: string): void {
        this.selectedModelId = modelId;
        // Load model on demand
        if (!this.models3D[modelId]) {
            const model = this.models.find(model => model.id === modelId);
            this.gltfLoader.load(model.glb, gltf => (this.models3D[model.id] = gltf.scene));
        }
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
        while (this.scene.children.length >= 3) {
            this.scene.remove(this.scene.children[this.scene.children.length - 1]);
        }
    }

    public removeLastModel(): void {
        if (this.scene.children.length >= 3) {
            this.scene.remove(this.scene.children[this.scene.children.length - 1]);
        }
    }

    public async activateXR(): Promise<void> {
        // Bail out early if WebXR is not supported by browser
        if (!navigator.xr) {
            alert('Unfortunately, your browser does not support WebXR. 😥 💔 📵');
            return;
        }

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

            // Check if viewport center has a hit test and update nopsy position
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);
            if (hitTestResults.length > 0 && this.nopsy) {
                const hitPose = hitTestResults[0].getPose(this.referenceSpace);
                if (hitPose) {
                    this.nopsy.visible = true;
                    const pos = hitPose.transform.position;
                    this.nopsy.position.set(pos.x, pos.y, pos.z);
                }
                this.nopsy.updateMatrixWorld(true);
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
