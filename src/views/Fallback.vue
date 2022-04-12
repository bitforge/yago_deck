<template>
    <div class="fallback">
        <branding />
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, DrawType } from 'qr-code-styling';
import Branding from '@/components/Branding.vue';

@Component({
    components: {
        Branding,
    },
})
export default class FallbackContent extends Vue {
    private state = getModule(GlobalState, this.$store);

    // QR Code styling options
    private qrUrl = 'https://deck.yago.cloud';
    private qrCode: QRCodeStyling | null = null;
    private qrOptions = {
        width: 250,
        height: 250,
        type: 'svg' as DrawType,
        data: this.qrUrl,
        dotsOptions: {
            type: 'rounded' as DotType,
        },
        cornersSquareOptions: {
            type: 'dot' as CornerSquareType,
        },
        cornersDotOptions: {
            type: 'dot' as CornerDotType,
        },
    };

    public mounted(): void {
        // Render QR code when WebXR is not supported
        if (!this.state.xrSupported) this.renderQRCode();
    }

    private renderQRCode(): void {
        const qrElement = document.querySelector('.qr-element') as HTMLElement;
        if (!qrElement) return;

        this.qrUrl = window.location.toString();
        this.qrCode = new QRCodeStyling(this.qrOptions);
        this.qrCode.append(qrElement);
        this.qrCode?.update(this.qrOptions);
    }
}
</script>

<style>
.fallback {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 10px;
    background-color: white;
}

.fallback h2 {
    font-size: 24px;
}

.fallback h3 {
    font-size: 22px;
}

.fallback h4 {
    font-size: 18px;
}

.fallback a,
.fallback a:hover,
.fallback a:visited {
    color: black;
}

.qr-element {
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 8px;
    margin: 32px 8px;
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
