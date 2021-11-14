<template>
    <!-- This is the UI that gets rendered on top of WebXR session -->
    <div class="domOverlay" :class="{ viewOnly: $store.state.viewOnlyMode }">
        <div class="models-deck" v-show="showDeck">
            <model-cards />
        </div>
        <toolbar v-show="showToolbar" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelCards from '@/components/ModelCards.vue';
import Toolbar from '@/components/Toolbar.vue';
import ToolbarButton from '@/components/ToolbarButton.vue';
import { Events } from '@/events';
import { Model } from '@/api';

@Component({
    components: {
        ModelCards,
        Toolbar,
        ToolbarButton,
    },
})
export default class DomOverlay extends Vue {
    private selectedModel: Model | null = null;

    public mounted(): void {
        this.$root.$on(Events.SelectModel, this.onModelSelected);
    }

    public beforeDestroy(): void {
        this.$root.$off(Events.SelectModel, this.onModelSelected);
    }

    private onModelSelected(modelId: string) {
        this.selectedModel = this.$store.getters.getModelById(modelId) as Model;
    }

    public get showDeck(): void {
        // Card are visible when WebXR is supported
        return this.$store.state.xrSupported;
    }

    public get showToolbar(): boolean {
        // Show toolbar when XR session is active or in dev mode
        return this.$store.state.xrActive || this.$store.state.devMode;
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
}

.domOverlay .hideable {
    transition: transform 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.domOverlay .swiper.hideable {
    transition: transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.domOverlay.viewOnly .hideable {
    transform: translateY(100px);
}

.domOverlay.viewOnly .swiper.hideable {
    transform: translateY(320px);
}

.models-deck {
    height: 235px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
}
</style>
