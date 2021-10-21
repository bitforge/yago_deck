<template>
  <div class="webXrModels">
    <div v-for="model in models" :key="model.id" class="models">
      <img :src="model.image" :alt="model.name + ' Preiview'" width="60%" />
      <br />
      <button @click="activateXR(model.glb)">{{ model.name }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Configuration } from "@/api/runtime";
import { Component, Vue } from "vue-property-decorator";
import { ModelsApi } from "@/api/apis/ModelsApi";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  Scene,
  DirectionalLight,
  WebGLRenderer,
  PerspectiveCamera,
  Group,
  XRFrame,
} from "three";
import { Model } from "@/api";

@Component
export default class WebXrApi extends Vue {
  private projectId = "dfe91633-9d4c-4cf3-be2e-eb0ab036add3";
  private apiKey = "Token bf51a81599630627c69dfb90561983627ef1e66f";
  private models: Model[] = [];
  private async mounted(): Promise<void> {
    try {
      const modelApi = new ModelsApi(
        new Configuration({ apiKey: this.apiKey })
      );

      const m = await modelApi.modelsList({ project: this.projectId });

      this.updateModels(m);
    } catch (error: any) {
      console.log("Wrong Password" + error);
    }
  }

  private updateModels(m: Model[]): void {
    this.models = m;
  }

  private async activateXR(glb: string) {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", {
      xrCompatible: true,
    }) as WebGLRenderingContext;

    const scene = new Scene();

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 15, 10);
    scene.add(directionalLight);

    // Set up the WebGLRenderer, which handles rendering to the session's base layer.
    const renderer = new WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: canvas,
      context: gl,
    });
    renderer.autoClear = false;

    // The API directly updates the camera matrices.
    // Disable matrix auto updates so three.js doesn't attempt
    // to handle the matrices independently.
    const camera = new PerspectiveCamera();
    camera.matrixAutoUpdate = false;

    // Initialize a WebXR session using "immersive-ar".
    const xr = (navigator as any).xr;
    if (xr == null) {
      throw new Error("WebXR not supported");
    }

    const session = await xr.requestSession("immersive-ar", {
      requiredFeatures: ["hit-test"],
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

    const loader = new GLTFLoader();
    let reticle: Group;
    loader.load(
      "https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf",
      function (gltf) {
        reticle = gltf.scene;
        reticle.visible = false;
        scene.add(reticle);
      }
    );

    let model: Group;
    loader.load(glb, function (gltf) {
      model = gltf.scene;
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    session.addEventListener("select", (evt: Event) => {
      if (model) {
        const clone = model.clone();
        clone.position.copy(reticle.position);
        scene.add(clone);
      }
    });

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
        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);

        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0 && reticle) {
          const hitPose = hitTestResults[0].getPose(referenceSpace);
          if (hitPose) {
            reticle.visible = true;
            reticle.position.set(
              hitPose.transform.position.x,
              hitPose.transform.position.y,
              hitPose.transform.position.z
            );
          }
          reticle.updateMatrixWorld(true);
        }

        // Render the scene with THREE.WebGLRenderer.
        renderer.render(scene, camera);
      }
    };
    session.requestAnimationFrame(onXRFrame);
  }
}
</script>

<style scoped>
.models {
  margin: 10px;
  padding: 20px;
  padding-bottom: 40px;
  border: solid 2px black;
  border-radius: 25px;
}
</style>
