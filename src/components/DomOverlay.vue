<template>
    <!-- Component must be use only once in document! -->
    <div id="domOverlay">
        <div class="toolbar">
            <button @click="undoLastModel">
                <img src="~@/assets/img/undo.svg" />
                <span>Undo</span>
            </button>
            <button @click="clearModels">
                <img src="~@/assets/img/delete.svg" />
                <span>Clear</span>
            </button>
        </div>
        <div class="touch" ref="touch" @click="placeModel">
            <p>Tap anywhere to place!</p>
        </div>
        <div class="slider" ref="slider">
            <div class="slides">
                <div v-for="(model, index) in $store.state.models" :key="index" class="slide">
                    <button
                        v-if="model.id == selectedModelId"
                        class="slide selected"
                        :style="{ backgroundImage: 'url(' + model.image + ')' }"></button>
                    <button
                        v-else
                        class="slide"
                        :style="{ backgroundImage: 'url(' + model.image + ')' }"
                        @click="selectModel(model.id)"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Messages } from '@/Messaging';

@Component
export default class DomOverlay extends Vue {
    public selectedModelId = '';

    public placeModel(): void {
        this.$bus.$emit(Messages.MODEL_PLACE, this.selectedModelId);
    }

    public undoLastModel(): void {
        this.$bus.$emit(Messages.MODEL_UNDO);
    }

    public clearModels(): void {
        this.$bus.$emit(Messages.MODEL_CLEAR);
    }

    public selectModel(modelId: string): void {
        this.selectedModelId = modelId;
        this.$bus.$emit(Messages.MODEL_SELECT, modelId);
    }
}
</script>

<style>
.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    position: absolute;
    bottom: 140px;
    left: 0;
    right: 0;

    padding-top: calc(env(safe-area-inset-top) + 10px);
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
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

.toolButton img {
    width: 24px;
    height: 24px;
    padding: 4px;
}

.touch {
    top: 100px;
    left: 0;
    right: 0;
    bottom: 121px;
    position: absolute;
}

.touch p {
    position: absolute;
    color: #fff;
    font-size: 12px;
    bottom: 10px;
    right: 0;
    left: 0;
}

.touch button:active {
    border: solid 2px #4285f4;
}

.slider {
    width: 100%;
    height: 120px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: env(safe-area-inset-bottom, 20px);
    text-align: center;
    overflow: hidden;
}

.slides {
    position: absolute;
    left: 10px;
    right: 0;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    display: hide;
}

.slide {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #fff;
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: none;
    display: flex;
}

.slide.selected {
    border: 2px solid #4285f4;
}

.slide:focus {
    outline: none;
}

.slide:focus-visible {
    outline: 1px solid #4285f4;
}
</style>
