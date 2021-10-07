<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";

@Component
export default class WebXR extends Vue {
  private camera: any;
  private scene: any;
  private renderer: any; 
  private mesh: any;

  private init(): void {
    let container = document.getElementById("container")!;
    this.camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.01,
      10
    );
    this.camera.position.z = 1;
    this.scene = new THREE.Scene();
    let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    let material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
  }

  private animate(): void {
    requestAnimationFrame(this.animate);
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }
}
</script>

<style>
</style>
