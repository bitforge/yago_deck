// @ts-nocheck

import { Component, Vue } from "vue-property-decorator";
import { Configuration, Model, ModelsApi } from "@/api";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Scene,
  DirectionalLight,
  LightProbe,
  WebGLRenderer,
  PerspectiveCamera,
  Group,
  XRFrame,
} from "three";

@Component
export default class WebXr extends Vue {
  private apiKey = "Token bf51a81599630627c69dfb90561983627ef1e66f";
  // Genie Demo Projekt
  private projectId = "dfe91633-9d4c-4cf3-be2e-eb0ab036add3";
  // Models from Project (Genie Demo)
  private models: Model[] = [];
  // selected button/model
  private selectedModelId = "";
  // Toggles UI layer visiblity
  private xrSessionActive = false;

  // WebXR:
  private modelsObjecdt3D: { [id: string]: Group } = {};
  private gltfLoader = new GLTFLoader();
  private reticle: Group;
  private scene = new Scene();
  private camera = new PerspectiveCamera();
  private xrLightProbe: XRLightEstimate | null;

  // THREE.js Lightning
  private directionalLight = new DirectionalLight(0xffffff, 1);
  private lightProbe = new LightProbe();

  private async mounted(): Promise<void> {
    try {
      const modelApi = new ModelsApi(
        new Configuration({ apiKey: this.apiKey })
      );
      const modelList = await modelApi.modelsList({ project: this.projectId });
      this.updateModels(modelList);
      // setting first model as selected
      this.updateSelectedModelId(this.models[0].id);
      this.loadReticle();
      this.addLightning();
    } catch (error: any) {
      console.log(error);
    }
  }

  private updateModels(models: Model[]): void {
    this.models = models;
  }

  private updateSelectedModelId(modelId: string): void {
    this.selectedModelId = modelId;
  }

  private loadReticle(): void {
    this.gltfLoader.load(
      "https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf",
      (gltf) => {
        this.reticle = gltf.scene;
        this.reticle.visible = false;
        this.scene.add(this.reticle);
      }
    );
  }

  private addLightning(): void {
    this.scene.add(this.directionalLight);
    this.scene.add(this.lightProbe);
  }

  private loadModelsObject3D(): void {
    for (const model of this.models) {
      this.gltfLoader.load(
        model.glb,
        (gltf) => (this.modelsObjecdt3D[model.id] = gltf.scene)
      );
    }
  }

  private placeModel(): void {
    if (this.modelsObjecdt3D[this.selectedModelId]) {
      const clone = this.modelsObjecdt3D[this.selectedModelId].clone();
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

  private updateLightningEstimate(frame: XRFrame): void {
    // Get light estimate from XRFrame
    const lightEstimate = frame.getLightEstimate(this.xrLightProbe);
    // Calculate max light intensity
    const primary = lightEstimate.primaryLightIntensity;
    const maxLight = Math.max(primary.x, Math.max(primary.y, primary.z));
    const intensity = Math.max(1.0, maxLight);
    this.directionalLight.intensity = intensity;
    // Set directional light position and color
    const direction = lightEstimate.primaryLightDirection;
    this.directionalLight.position.set(direction.x, direction.y, direction.z);
    this.directionalLight.color.setRGB(
      primary.x / intensity,
      primary.y / intensity,
      primary.z / intensity
    );
    // Update light estimation harmonics
    this.lightProbe.sh.fromArray(lightEstimate.sphericalHarmonicsCoefficients);
  }

  private async activateXR(): Promise<void> {
    const canvas = this.$refs.glcanvas;
    const gl = canvas.getContext("webgl", {
      xrCompatible: true,
    }) as WebGLRenderingContext;

    // Renderer
    const renderer = new WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: canvas,
      context: gl,
    });
    renderer.autoClear = false;

    // Camera
    this.camera.matrixAutoUpdate = false;

    // Session
    const xr = (navigator as any).xr;
    const session = await xr.requestSession("immersive-ar", {
      requiredFeatures: ["hit-test", "light-estimation"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: this.$refs.domOverlay },
    });
    session.updateRenderState({
      baseLayer: new XRWebGLLayer(session, gl),
    });

    const referenceSpace = await session.requestReferenceSpace("local");
    const viewerSpace = await session.requestReferenceSpace("viewer");
    const hitTestSource = await session.requestHitTestSource({
      space: viewerSpace,
    });

    // Create XR Light Probe
    this.xrLightProbe = await session.requestLightProbe();

    // Load Genie models list
    this.loadModelsObject3D();

    // Show DOM overlay once XR Session is active
    this.xrSessionActive = true;

    // Create a render loop that allows us to draw on the AR view.
    const onXRFrame = (time: number, frame: XRFrame) => {
      // Queue up the next draw request.
      session.requestAnimationFrame(onXRFrame);

      // Update Lightning from light estimate
      this.updateLightningEstimate(frame);

      // Bind the graphics framebuffer to the baseLayer's framebuffer
      gl.bindFramebuffer(
        gl.FRAMEBUFFER,
        session.renderState.baseLayer.framebuffer
      );

      // Retrieve the pose of the device.
      // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
      const pose = frame.getViewerPose(referenceSpace);
      if (pose) {
        // In mobile AR, we only have one view.
        const view = pose.views[0];
        const viewport = session.renderState.baseLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height);

        // Use the view's transform matrix and projection matrix to configure the THREE.camera.
        this.camera.matrix.fromArray(view.transform.matrix);
        this.camera.projectionMatrix.fromArray(view.projectionMatrix);
        this.camera.updateMatrixWorld(true);
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0 && this.reticle) {
          const hitPose = hitTestResults[0].getPose(referenceSpace);
          if (hitPose) {
            this.reticle.visible = true;
            this.reticle.position.set(
              hitPose.transform.position.x,
              hitPose.transform.position.y,
              hitPose.transform.position.z
            );
          }
          this.reticle.updateMatrixWorld(true);
        }
        // Render the scene with THREE.WebGLRenderer.
        renderer.render(this.scene, this.camera);
      }
    };
    session.requestAnimationFrame(onXRFrame);
  }
}
