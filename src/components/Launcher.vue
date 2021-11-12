<template>
    <div class="launcher">
        <div class="launch-area" v-if="xrSupported">
            <button slot="ar-button" id="ar-button" @click="launchXR">
                <img src="~@/assets/img/ar_icon.svg" />
                Launch Demo 🥳🤳🪴
            </button>
        </div>
        <div class="fallback-area" v-if="!xrSupported">
            <h2>WebXR not supported.</h2>
            <h3>📵 🤳 🪴 💔 😢</h3>
            <h4>This Demo was made for Android devices.</h4>
            <p>
                Please scan the following QR Code with an <br />
                <a href="https://developers.google.com/ar/devices" target="_blank">ARCore supported device</a>:
            </p>
            <div class="qr-element" ref="qrcode"></div>
            <p>
                <a class="qr-link" :href="qrUrl">{{ qrUrl }}</a>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, DrawType } from 'qr-code-styling';
import { Configuration, ModelsApi } from '@/api';
import { Messages } from '@/Messaging';

@Component
export default class Launcher extends Vue {
    private apiKey = 'Token bf51a81599630627c69dfb90561983627ef1e66f';
    // Using feey plants as demo project
    private projectId = '03d861a8-90fe-42bb-aeba-a4aead7917ea';

    private xrSupported = false;

    private qrUrl = 'https://webxr.genie-ar.ch';
    private qrCode: QRCodeStyling | null = null;
    private qrOptions = {
        width: 250,
        height: 250,
        type: 'svg' as DrawType,
        data: this.qrUrl,
        dotsOptions: {
            type: 'rounded' as DotType,
            color: '#074e68',
        },
        cornersSquareOptions: {
            type: 'dot' as CornerSquareType,
            color: '#042633',
        },
        cornersDotOptions: {
            type: 'dot' as CornerDotType,
            color: '#042633',
        },
    };

    public mounted(): void {
        this.xrSupported = (navigator as any).xr !== undefined;
        this.$store.commit('setXRSupported', this.xrSupported);
        this.loadModels();
        this.renderQRCode();
    }

    private renderQRCode(): void {
        this.qrUrl = window.location.toString();
        this.qrCode = new QRCodeStyling(this.qrOptions);
        this.qrCode.append(this.$refs.qrcode as HTMLElement);
        this.qrCode?.update(this.qrOptions);
    }

    private async loadModels(): Promise<void> {
        try {
            const modelApi = new ModelsApi(new Configuration({ apiKey: this.apiKey }));
            const models = await modelApi.modelsList({ project: this.projectId });
            this.$store.commit('setModels', models);
            this.$root.$emit(Messages.MODELS_LOADED);
        } catch (error: any) {
            console.log(error);
        }
    }

    public launchXR(): void {
        // Bail out early if WebXR is not supported by browser
        if (!this.xrSupported) return;

        // Start things off with an event
        this.$root.$emit(Messages.LAUNCH_XR);
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
    background-color: #333;
    z-index: 10;
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

.fallback-area {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.fallback-area h2 {
    font-size: 24px;
    color: white;
}

.fallback-area h3 {
    font-size: 22px;
    color: white;
}

.fallback-area h4 {
    font-size: 18px;
    color: white;
}

.fallback-area p {
    color: white;
}

.fallback-area a,
.fallback-area a:hover,
.fallback-area a:visited {
    color: white;
}

.qr-element {
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 8px;
    margin: 8px;
    background: black;
    border-radius: 8px;
}

.qr-element img {
    display: block;
}

.qr-link {
    text-decoration: none;
}
</style>
