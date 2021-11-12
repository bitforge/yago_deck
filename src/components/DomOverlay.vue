<template>
    <!-- Component must be use only once in document! -->
    <div id="domOverlay" v-show="showOverlay">
        <div class="touch" ref="touch" @click="placeModel"></div>
        <div class="model-selector">
            <model-cards />
        </div>
        <div class="toolbar">
            <button @click="undoLastModel">
                <span class="material-icons">undo</span>
                <span>Undo</span>
            </button>
            <button @click="takeScreenshot" class="screenshot">
                <span class="material-icons">camera</span>
            </button>
            <button @click="clearModels">
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
    private selectedModel: Model | null = null;

    public get showOverlay(): boolean {
        // Uncomment to show overlay locally
        // if (process.env.NODE_ENV === 'development') return true;
        return this.$store.state.xrActive;
    }

    public placeModel(): void {
        const modelId = this.selectedModel?.id;
        this.$root.$emit(Messages.MODEL_PLACE, modelId);
    }

    public undoLastModel(): void {
        this.$root.$emit(Messages.MODEL_UNDO);
    }

    public takeScreenshot(): void {
        this.$root.$emit(Messages.SAVE_SCREENSHOT);
    }

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

.touch {
    margin-top: calc(env(safe-area-inset-top) + 20px);
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
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
}

.toolbar button {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    padding: 8px 16px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.toolbar .material-icons {
    margin: 4px;
}

.toolbar .screenshot {
    padding: 4px 12px;
    transform: scale(1.15);
}

.toolbar .screenshot .material-icons {
    font-size: 36px;
}
</style>
