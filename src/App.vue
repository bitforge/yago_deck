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
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
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
    private state = getModule(GlobalState, this.$store);
    private xrSupported = false;

    public async mounted(): Promise<void> {
        // Feature detect WebXR support
        this.xrSupported = navigator.xr !== undefined;

        // Fake WebXR support in local dev mode
        // Comment next line to work on fallback view in development
        if (this.state.devMode) this.xrSupported = true;
        this.state.setXRSupported(this.xrSupported);

        // Delayed check for immersive mode for Chrome on Desktop
        if (navigator.xr) {
            this.xrSupported = await navigator.xr.isSessionSupported('immersive-ar');
            this.state.setXRSupported(this.xrSupported);
        }
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
