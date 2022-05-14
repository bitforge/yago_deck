<template>
    <!-- This is the UI that gets rendered on top of WebXR session -->
    <div class="domOverlay" :class="{ viewOnly: state.viewOnlyMode }">
        <top-bar v-show="showTopBar" />
        <models-deck v-show="showDeck" />
        <toolbar v-show="showToolbar" />
        <cart-view v-show="showCart" />
        <onboarding v-show="showOnboarding" />
        <!-- Initalized in WebXR.vue view -->
        <div class="render-stats" v-show="showStats"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import TopBar from '@/components/TopBar.vue';
import ModelsDeck from '@/components/ModelsDeck.vue';
import Toolbar from '@/components/Toolbar.vue';
import Onboarding from '@/components/Onboarding.vue';
import CartView from '@/views/CartView.vue';
import { Events } from '@/events';
import { Model } from '@bitforgehq/yago-api-client';

@Component({
    components: {
        TopBar,
        ModelsDeck,
        Toolbar,
        CartView,
        Onboarding,
    },
})
export default class DomOverlay extends Vue {
    private state = getModule(GlobalState, this.$store);
    public selectedModel: Model | null = null;

    public mounted(): void {
        this.$root.$on(Events.SelectModel, this.onModelSelected);
    }

    public beforeDestroy(): void {
        this.$root.$off(Events.SelectModel, this.onModelSelected);
    }

    public onModelSelected(modelId: string): void {
        const model = this.state.getModelById(modelId);
        if (model) this.selectedModel = model;
    }

    public get showTopBar(): boolean {
        return this.state.xrActive;
    }

    public get showDeck(): boolean {
        return (this.state.xrSupported && !this.state.xrActive) || (this.state.xrActive && this.state.xrTracking);
    }

    public get showToolbar(): boolean {
        return this.state.xrActive || this.state.devMode;
    }

    public get showOnboarding(): boolean {
        return this.state.xrActive;
    }

    public get showCart(): boolean {
        return this.state.showCart;
    }

    public get showStats(): boolean {
        return this.state.xrActive && this.state.devMode;
    }
}
</script>

<style>
.domOverlay {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;

    pointer-events: none;
    padding-top: calc(env(safe-area-inset-top) + 20px);
    padding-bottom: env(safe-area-inset-bottom);
    --easeInOutBack: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.domOverlay .hideable {
    transition: transform 0.3s var(--easeInOutBack);
}

.domOverlay .swiper.hideable {
    transition: transform 0.5s var(--easeInOutBack);
}

.domOverlay .top-bar.hideable {
    transition: transform 0.3s var(--easeInOutBack);
}

.domOverlay.viewOnly .hideable {
    transform: translateY(100px);
}

.domOverlay.viewOnly .swiper.hideable {
    transform: translateY(320px);
}

.domOverlay.viewOnly .top-bar.hideable {
    transform: translateY(-140px);
}
</style>
