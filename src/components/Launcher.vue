<template>
    <div class="launcher">
        <div class="branding">
            <img src="~@/assets/img/genie_white.png" alt="Genie" class="genie" />
            <img src="~@/assets/img/logo_white.svg" alt="deck" class="deck" />
        </div>
        <div class="launch-area" v-if="xrSupported">
            <p>It's all one big session.</p>
            <button class="xr-button" @click="launchXR">
                <img src="~@/assets/img/ar_icon.svg" />
                Launch Demo 🥳🤳🪴
            </button>
            <div class="spacer"></div>
        </div>
        <!-- Show QR Code with link to app when XR is not supported -->
        <fallback-content v-if="!xrSupported" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FallbackContent from '@/components/FallbackContent.vue';
import { Configuration, ModelsApi, Model, ModelStatus } from '@/api';
import { Events } from '@/events';
import { Actions } from '@/store';

@Component({
    components: {
        FallbackContent,
    },
})
export default class Launcher extends Vue {
    private xrSupported = false;

    public mounted(): void {
        // Feature detect WebXR support
        this.xrSupported = (navigator as any).xr !== undefined;
        // Fake WebXR support in local dev mode
        // Uncomment this work on fallback view
        if (this.$store.state.devMode) this.xrSupported = true;
        this.$store.commit('setXRSupported', this.xrSupported);

        // Load models when we have support for WebXR
        if (this.xrSupported || this.$store.state.devMode) {
            this.loadModels();
        }
    }

    private async loadModels(): Promise<void> {
        try {
            const modelApi = new ModelsApi(new Configuration({ apiKey: process.env.VUE_APP_API_KEY }));
            const models = await modelApi.modelsList({ project: process.env.VUE_APP_PROJECT_ID });
            const visibleModels = models.filter((model: Model) => model.status != ModelStatus.Draft);
            this.$store.commit(Actions.SetModels, visibleModels);
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
    background-color: rgb(42, 44, 48);
    z-index: 10;
}

.launcher p {
    color: white;
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

.branding {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px;
}

.branding img.genie {
    width: 140px;
    margin: 8px;
}

.branding img.deck {
    width: 140px;
    margin: 8px;
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
    margin: 16px 0;
    background-color: #074e68;
    color: white;
    height: 64px;
    line-height: 32px;
    border: 1px solid #042d3b;
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
