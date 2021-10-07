<template>
  <div id="app">
    <WebXR></WebXR>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WebXR from "./components/WebXR.vue";

@Component({
  components: {
    WebXR,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
