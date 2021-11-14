<template>
    <div id="app">
        <web-xr>
            <dom-overlay />
        </web-xr>
        <launcher />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Launcher from './views/Launcher.vue';
import DomOverlay from './components/DomOverlay.vue';
import WebXr from './views/WebXR.vue';
@Component({
    components: {
        Launcher,
        DomOverlay,
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
