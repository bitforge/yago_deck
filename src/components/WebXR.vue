<template>
  <div class="webxr">
    <canvas ref="glcanvas" class="glcanvas"></canvas>
    <button slot="ar-button" id="ar-button" @click="activateXR()">
      View in your Space
    </button>
    <div claas="domOverlay" ref="domOverlay">
      <div class="touch" ref="touch" @click="placeModel()"></div>
      <div class="slider" ref="slider">
        <div class="slides">
          <div v-for="(model, index) in models" :key="index" class="slide">
            <button
              v-if="model.id == selectedModelId"
              class="slide selected"
              :style="{ backgroundImage: 'url(' + model.image + ')' }"
            ></button>
            <button
              v-else
              class="slide"
              :style="{ backgroundImage: 'url(' + model.image + ')' }"
              @click="updateSelectedModelId(model.id)"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Configuration, Model, ModelsApi } from "@/api";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  Scene,
  DirectionalLight,
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

  // WebXR:
  private modelsObjecdt3D: { [id: string]: Group } = {};
  private gltfLoader = new GLTFLoader();
  private reticle: Group;
  private scene = new Scene();
  // private canvas = this.$refs.glcanvas;
  // private gl = this.canvas.getContext("webgl", {
  //   xrCompatible: true,
  // }) as WebGLRenderingContext;
  // private renderer = new WebGLRenderer({
  //   alpha: true,
  //   preserveDrawingBuffer: true,
  //   canvas: this.canvas,
  //   context: this.gl,
  // });
  private camera = new PerspectiveCamera();

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

  private loadModelsObject3D(): void {
    for (let model of this.models) {
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

  private async activateXR(): Promise<void> {
    const canvas = this.$refs.glcanvas;
    const gl = canvas.getContext("webgl", {
      xrCompatible: true,
    }) as WebGLRenderingContext;
    // Lightning
    // const directionalLight = new THREE.DirectionalLightHelper(0xffffff, 0.3);
    // directionalLight.position.set(10, 15, 10);
    // scene.add(directionalLight);

    // Renderer
    const renderer = new WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: this.canvas,
      context: gl,
    });
    renderer.autoClear = false;

    // Camera    const camera = new THREE.PerspectiveCamera();
    this.camera.matrixAutoUpdate = false;

    // Session
    var xr = (navigator as any).xr;
    const session = await xr.requestSession("immersive-ar", {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: this.$refs.domOverlay },
    });
    session.updateRenderState({
      baseLayer: new XRWebGLLayer(session, gl),
    });
    // A 'local' reference space has a native origin that is located
    // near the viewer's position at the time the session was created.
    const referenceSpace = await session.requestReferenceSpace("local");
    // Create another XRReferenceSpace that has the viewer as the origin.
    const viewerSpace = await session.requestReferenceSpace("viewer");
    // Perform hit testing using the viewer as origin.
    const hitTestSource = await session.requestHitTestSource({
      space: viewerSpace,
    });
    // GLTFLoader

    this.loadModelsObject3D();

    // session.addEventListener("seelct", (evt: Event) => {
    //   this.placeModel();
    // });

    // session.addEventListener("select", (evt: Event) => {
    //   if (this.modelsObjecdt3D[this.selectedModelId]) {
    //     const clone = this.modelsObjecdt3D[this.selectedModelId].clone();
    //     clone.position.copy(this.reticle.position);
    //     this.scene.add(clone);
    //   }
    // });

    // Create a render loop that allows us to draw on the AR view.
    const onXRFrame = (time: number, frame: XRFrame) => {
      // Queue up the next draw request.
      session.requestAnimationFrame(onXRFrame);
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
</script>

<style scoped>
.webxr {
  overflow-x: hidden;
}

.glcanvas {
  z-index: 1;
  transform: translateZ(0);
  pointer-events: none;
}

#ar-button {
  background-image: url("https://modelviewer.dev/assets/ic_view_in_ar_new_googblue_48dp.png");
  background-repeat: no-repeat;
  background-size: 20px 20px;
  background-position: 12px 50%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  bottom: 132px;
  padding: 0px 16px 0px 40px;
  font-family: Roboto Regular, Helvetica Neue, sans-serif;
  font-size: 14px;
  color: #4285f4;
  height: 36px;
  line-height: 36px;
  border-radius: 18px;
  border: 1px solid #dadce0;
  z-index: 2;
}

#ar-button:active {
  background-color: #e8eaed;
}

#ar-button:focus {
  outline: none;
}

#ar-button:focus-visible {
  outline: 1px solid #4285f4;
}

.touch {
  border: 5px solid orange;
  top: 0;
  left: 0;
  right: 0;
  bottom: 121px;
  position: absolute;
}

.slider {
  width: 100%;
  text-align: center;
  overflow: hidden;
  position: absolute;
  border: 2px solid red;
  z-index: 2;
  left: 0;
  right: 0;
  height: 120px;
  bottom: 0;
}

.slides {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
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
  margin-right: 10px;
  border-radius: 10px;
  border: none;
  display: flex;
  /* border: 1px solid #4285f4; */
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
