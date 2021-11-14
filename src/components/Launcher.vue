<template>
    <div class="launcher">
        <div class="branding">
            <img src="~@/assets/img/genie_white.png" alt="Genie" class="genie" />
            <img src="~@/assets/img/logo_white.svg" alt="deck" class="deck" />
        </div>
        <div class="launch-area" v-if="xrSupported || devMode">
            <p>It's all one big session.</p>
            <button class="xr-button" @click="launchXR">
                <img src="~@/assets/img/ar_icon.svg" />
                Launch Demo 🥳🤳🪴
            </button>
            <div class="spacer"></div>
        </div>
        <div class="fallback-area" v-if="!xrSupported && !devMode">
            <h2>WebXR not supported.</h2>
            <h3>📵 🤳 🪴 💔 😢</h3>
            <h4>This Demo was made for Android devices.</h4>
            <p>
                Please scan the following QR Code with an <br />
                <a href="https://developers.google.com/ar/devices" target="_blank" class="external">
                    ARCore supported device.
                </a>
            </p>
            <div class="qr-element"></div>
            <p>
                <a class="qr-link" :href="qrUrl">{{ qrUrl }}</a>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, DrawType } from 'qr-code-styling';
import { Configuration, ModelsApi, ModelsListStatusEnum } from '@/api';
import { Messages } from '@/messages';

@Component
export default class Launcher extends Vue {
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

    public get devMode(): boolean {
        // Toggle lines to show WebXR compatiblity message in dev
        // return false;
        return process.env.NODE_ENV === 'development';
    }

    public mounted(): void {
        // Feature detect WebXR support
        this.xrSupported = (navigator as any).xr !== undefined;
        this.$store.commit('setXRSupported', this.xrSupported);

        // Initialize
        if (this.xrSupported || this.devMode) {
            this.loadModels();
        } else {
            this.renderQRCode();
        }
    }

    private renderQRCode(): void {
        const qrElement = document.querySelector('.qr-element') as HTMLElement;
        if (!qrElement) return;

        this.qrUrl = window.location.toString();
        this.qrCode = new QRCodeStyling(this.qrOptions);
        this.qrCode.append(qrElement);
        this.qrCode?.update(this.qrOptions);
    }

    private async loadModels(): Promise<void> {
        try {
            const modelApi = new ModelsApi(new Configuration({ apiKey: process.env.VUE_APP_API_KEY }));
            // TODO: Filter for status READY and ONLINE
            // Unfortunately no possible with generated api atm.
            const models = await modelApi.modelsList({
                project: process.env.VUE_APP_PROJECT_ID,
                status: ModelsListStatusEnum.Ready,
            });
            this.$store.commit('setModels', models);
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
        // Show error when in dev mode
        if (!this.xrSupported && this.devMode) {
            alert('WebXR not supported. 😢');
            return;
        }

        // Everything is triggered via an event
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
