<template>
    <div class="onboarding">
        <modal v-show="showTrackingHint">
            <img src="~@/assets/img/plane_scanning.png" />
            <p>Point your phone down at an empty space, and move it around slowly.</p>
        </modal>
        <modal v-show="showPlacingHint">
            <p class="xlarge">🎯 👉 🪴 🥳</p>
            <p>Tap the current card to place the model!</p>
        </modal>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import Modal from '@/components/Modal.vue';

@Component({
    components: {
        Modal,
    },
})
export default class Onboarding extends Vue {
    private state = getModule(GlobalState, this.$store);
    public showPlacingHint = false;

    public get showTrackingHint(): boolean {
        return this.state.xrActive && !this.state.xrTracking;
    }

    @Watch('state.xrTrackingEstablished')
    public onXRTrackingEstablished(): void {
        if (!this.state.xrActive) return;
        if (!this.state.xrTrackingEstablished) return;

        // Show info message how to place model for after tracking hint seconds
        setTimeout(() => {
            this.showPlacingHint = true;
            setTimeout(() => {
                this.showPlacingHint = false;
            }, 2500);
        }, 800);
    }
}
</script>

<style>
.onboarding {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
}

p.xlarge {
    font-size: 32px;
}
</style>
