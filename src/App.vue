<template>
    <div id="app">
        <!-- Main WebXR view -->
        <web-xr />
        <!-- WebXR needs a launch button -->
        <launcher v-if="xrSupported" />
        <!-- Show QR Code with link to app when XR is not supported -->
        <fallback v-if="!xrSupported" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WebXr from '@/views/WebXR.vue';
import Launcher from '@/views/Launcher.vue';
import Fallback from '@/views/Fallback.vue';

@Component({
    components: {
        WebXr,
        Launcher,
        Fallback,
    },
})
export default class App extends Vue {
    private xrSupported = false;

    public mounted(): void {
        // Feature detect WebXR support
        this.xrSupported = (navigator as any).xr !== undefined;
        // Fake WebXR support in local dev mode
        // Comment this this line to work on fallback view
        if (this.$store.state.devMode) this.xrSupported = true;
        this.$store.commit('setXRSupported', this.xrSupported);
    }
}
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
