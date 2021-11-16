<template>
    <!-- This is the UI that gets rendered on top of WebXR session -->
    <div class="domOverlay" :class="{ viewOnly: state.viewOnlyMode }">
        <exit-button v-show="showExit" />
        <models-deck v-show="showDeck" />
        <toolbar v-show="showToolbar" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import ExitButton from '@/components/ExitButton.vue';
import ModelsDeck from '@/components/ModelsDeck.vue';
import Toolbar from '@/components/Toolbar.vue';
import { Events } from '@/events';
import { Model } from '@bitforgehq/genie-api-client';

@Component({
    components: {
        ExitButton,
        ModelsDeck,
        Toolbar,
    },
})
export default class DomOverlay extends Vue {
    private state = getModule(GlobalState, this.$store);
    private selectedModel: Model | null = null;

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

    public get showExit(): boolean {
        return this.state.xrActive;
    }

    public get showDeck(): boolean {
        return this.state.xrSupported;
    }

    public get showToolbar(): boolean {
        return this.state.xrActive || this.state.devMode;
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
</style>
