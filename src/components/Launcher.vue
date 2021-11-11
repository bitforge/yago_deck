<template>
    <div class="launcher">
        <button slot="ar-button" id="ar-button" @click="launchXR">
            <img src="~@/assets/img/ar_icon.svg" />
            👉 Launch Demo 👈 🥳🎉🤳🪴 👍
        </button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Configuration, ModelsApi } from '@/api';
import { EventBus, Messages } from '@/EventBus';

@Component
export default class WebXr extends Vue {
    private apiKey = 'Token bf51a81599630627c69dfb90561983627ef1e66f';
    // Using feey plants as demo project
    private projectId = '03d861a8-90fe-42bb-aeba-a4aead7917ea';

    private xrSupported = false;

    public mounted(): void {
        this.xrSupported = (navigator as any).xr !== undefined;
        if (this.xrSupported) {
            this.loadModels();
        }
    }

    public async loadModels(): Promise<void> {
        try {
            const modelApi = new ModelsApi(new Configuration({ apiKey: this.apiKey }));
            const models = await modelApi.modelsList({ project: this.projectId });
            EventBus.$emit(Messages.MODELS_LOADED, models);
        } catch (error: any) {
            console.log(error);
        }
    }

    public launchXR(): void {
        // Bail out early if WebXR is not supported by browser
        if (!this.xrSupported) return this.onWebXRFail();

        // Start things off with an event
        EventBus.$emit(Messages.LAUNCH_XR_SESSION);
    }

    private onWebXRFail(): void {
        alert('Unfortunately, your browser does not support WebXR. 😥 💔 📵');
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
    justify-content: center;
    align-items: center;
    background-color: #222;
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

#ar-button {
    animation: vibrant 0.8s infinite;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #074e68;
    color: white;
    height: 64px;
    line-height: 32px;
    border: 1px solid #042d3b;
    border-radius: 8px;
    padding: 0 16px;
    font-weight: 700;
    font-size: 16px;
    z-index: 10;
}

#ar-button:hover {
    background-color: #0d6c92;
}

#ar-button:active {
    background-color: #042633;
}

#ar-button img {
    width: 28px;
    height: 28px;
    padding: 4px;
}

#ar-button:focus {
    outline: none;
}

#ar-button:focus-visible {
    outline: 1px solid #4285f4;
}
</style>
