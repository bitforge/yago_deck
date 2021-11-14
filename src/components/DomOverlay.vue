<template>
    <!-- This is the UI that gets rendered on top of WebXR session -->
    <div class="domOverlay" :class="{ viewOnly: $store.state.viewOnlyMode }">
        <div class="models-deck" v-show="showDeck">
            <model-cards />
        </div>
        <div class="toolbar" v-show="showToolbar">
            <toolbar-button
                icon="undo"
                text="Undo"
                @click="unplaceModel"
                :hideable="true"
                :disabled="disableDeleteButtons" />
            <toolbar-button
                v-show="!$store.state.viewOnlyMode"
                icon="style"
                action="expand_more"
                @click="enableViewOnlyMode"
                :hideable="false" />
            <toolbar-button
                v-show="$store.state.viewOnlyMode"
                icon="expand_less"
                action="style"
                @click="disableViewOnlyMode"
                :hideable="false" />
            <toolbar-button
                icon="delete"
                text="Clear"
                @click="clearModels"
                :hideable="true"
                :disabled="disableDeleteButtons" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelCards from '@/components/ModelCards.vue';
import ToolbarButton from '@/components/ToolbarButton.vue';
import { Events } from '@/events';
import { Model } from '@/api';
import { Actions } from '@/store';

@Component({
    components: {
        ModelCards,
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
        // Show toolbar when XR session is active and in dev mode
        return this.$store.state.xrActive || this.$store.state.devMode;
    }

    public get disableDeleteButtons(): boolean {
        // Buttons are enabled when a model is placed
        return this.$store.state.placed.length == 0;
    }

    /** Place currently selected model on the plane */
    public placeModel(): void {
        const modelId = this.selectedModel?.id;
        this.$root.$emit(Events.PlaceModel, modelId);
    }

    /** Remove last placed model */
    public unplaceModel(): void {
        this.$store.commit(Actions.UnplaceModel);
        this.$root.$emit(Events.UnplaceModel);
    }

    /** Hide model selection cards */
    public enableViewOnlyMode(): void {
        this.$store.commit(Actions.SetViewOnlyMode, true);
    }

    /** Show model selection cards */
    public disableViewOnlyMode(): void {
        this.$store.commit(Actions.SetViewOnlyMode, false);
    }

    /** Remova ALL placed models */
    public clearModels(): void {
        this.$store.commit(Actions.ClearPlaced);
        this.$root.$emit(Events.ClearPlaced);
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

.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    pointer-events: auto;
    padding: 12px;
    z-index: 150;
}

.toolbar button {
    width: 70px;
    height: 70px;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.3);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.toolbar button span:nth-child(1) {
    font-size: 24px;
}

.toolbar button span:nth-child(2) {
    font-size: 14px;
}

.toolbar .material-icons {
    margin: 4px;
}
</style>
