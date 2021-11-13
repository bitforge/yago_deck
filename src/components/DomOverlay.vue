<template>
    <!-- Component must be use only once in document! -->
    <div id="domOverlay" v-show="showOverlay" :class="{ silent: isSilent }">
        <div class="touch" @click="placeModel"></div>
        <div class="model-selector">
            <model-cards />
        </div>
        <div class="toolbar">
            <button @click="undoLastModel" class="hideable">
                <span class="material-icons">undo</span>
                <span>Undo</span>
            </button>
            <button @click="hideCards" v-if="!isSilent">
                <span class="material-icons">style</span>
                <span class="material-icons">expand_more</span>
            </button>
            <button @click="showCards" v-if="isSilent">
                <span class="material-icons">expand_less</span>
                <span class="material-icons">style</span>
            </button>
            <button @click="clearModels" class="hideable">
                <span class="material-icons">delete</span>
                <span>Clear</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelCards from '@/components/ModelCards.vue';
import { Messages } from '@/messages';
import { Model } from '@/api';

@Component({
    components: {
        ModelCards,
    },
})
export default class DomOverlay extends Vue {
    public isSilent = false;

    private selectedModel: Model | null = null;

    public mounted(): void {
        this.$root.$on(Messages.MODEL_SELECT, this.onModelSelected);
    }

    public beforeDestroy(): void {
        this.$root.$off(Messages.MODEL_SELECT, this.onModelSelected);
    }

    private onModelSelected(modelId: string) {
        this.selectedModel = this.$store.getters.getModelById(modelId) as Model;
    }

    public get showOverlay(): boolean {
        // Uncomment next line to show overlay for development
        if (process.env.NODE_ENV === 'development') return true;
        return this.$store.state.xrActive;
    }

    /** Place currently selected model on the plane */
    public placeModel(): void {
        const modelId = this.selectedModel?.id;
        this.$root.$emit(Messages.MODEL_PLACE, modelId);
    }

    /** Remove last placed model */
    public undoLastModel(): void {
        this.$root.$emit(Messages.MODEL_UNDO);
    }

    /** Hide model selection cards */
    public hideCards(): void {
        this.isSilent = true;
        this.$root.$emit(Messages.SILENCE_ENTER);
    }

    /** Show model selection cards */
    public showCards(): void {
        this.isSilent = false;
        this.$root.$emit(Messages.SILENCE_EXIT);
    }

    /** Remova ALL placed models */
    public clearModels(): void {
        this.$root.$emit(Messages.MODEL_CLEAR);
    }
}
</script>

<style>
#domOverlay {
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
}

#domOverlay .hideable {
    transition: transform 0.3s ease-in-out;
}

#domOverlay .swiper.hideable {
    transition: transform 0.5s ease-in-out;
}

#domOverlay.silent .hideable {
    transform: translateY(100px);
}

#domOverlay.silent .swiper.hideable {
    transform: translateY(320px);
}

.touch {
    margin-top: calc(env(safe-area-inset-top) + 20px);
    flex-grow: 1;
    /* background-color: #000000aa; */
}

.touch p {
    color: #fff;
    font-size: 12px;
}

.model-selector {
    height: 235px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
