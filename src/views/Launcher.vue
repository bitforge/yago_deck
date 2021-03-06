<template>
    <div class="launcher">
        <branding />
        <div class="launch-area" v-if="state.xrSupported">
            <p>Next level Web-Shopping experience.</p>
            <p>Explores the capabilities of <a href="https://immersiveweb.dev/">WebXR</a>.</p>
            <p>Currently focused on Android devices.</p>
            <button class="xr-button" @click="launchXR">
                <img src="~@/assets/img/ar_icon.svg" />
                Launch Demo
            </button>
            <div class="spacer"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import Branding from '@/components/Branding.vue';
import { Events } from '@/events';

@Component({
    components: {
        Branding,
    },
})
export default class Launcher extends Vue {
    private state = getModule(GlobalState, this.$store);

    public mounted(): void {
        // Load models when we have support for WebXR
        if (this.state.xrSupported || this.state.devMode) {
            this.loadModels();
        }
    }

    private async loadModels(): Promise<void> {
        try {
            this.state.loadModels();
        } catch (error: any) {
            let errorMsg = error.toString();
            if (error instanceof Response) {
                errorMsg = `Status ${error.status} ${error.statusText}`;
            }
            alert(`Failed to load models: ${errorMsg}`);
            console.error(error);
        }
    }

    public launchXR(): void {
        // Check WebXR availability again
        const xrAvailable = (navigator as any).xr !== undefined;
        if (!xrAvailable) {
            alert('WebXR not supported. 😢');
            return;
        }

        // Everything is triggered via an event
        this.$root.$emit(Events.LaunchXR);
    }
}
</script>

<style>
.launcher {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: white;
    z-index: 10;
}

.launcher p {
    color: black;
}

.launcher a,
.launcher a:visited {
    color: black;
}

@keyframes vibrant {
    0% {
        transform: scale(1.05);
    }
    20% {
        transform: scale(1);
    }
    80% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.05);
    }
}

.launch-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.xr-button {
    animation: vibrant 0.8s infinite;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 32px 0 0 0;
    background-color: #fb3640;
    color: white;
    height: 64px;
    line-height: 32px;
    border: none;
    border-radius: 8px;
    padding: 0 16px;
    font-weight: 700;
    font-size: 16px;
}

.xr-button:hover {
    background-color: #0d6c92;
}

.xr-button:active {
    background-color: #042633;
}

.xr-button img {
    width: 28px;
    height: 28px;
    padding: 4px;
}

.xr-button:focus {
    outline: none;
}

.xr-button:focus-visible {
    outline: 1px solid #4285f4;
}

.spacer {
    height: 140px;
}
</style>
