<template>
    <div id="app">
        <WebXr></WebXr>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WebXr from './components/WebXR/WebXR.vue';
@Component({
    components: {
        WebXr,
    },
})
export default class App extends Vue {}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');

#app {
    font-family: Ubuntu, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
