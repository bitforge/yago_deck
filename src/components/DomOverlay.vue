<template>
    <!-- Component must be use only once in document! -->
    <div id="domOverlay">
        <div class="touch" ref="touch" @click="placeModel">
            <p v-show="showOverlay">Tap anywhere to place!</p>
        </div>
        <div class="toolbar" v-show="showOverlay">
            <button @click="undoLastModel">
                <img src="~@/assets/img/undo.svg" />
                <span>Undo</span>
            </button>
            <button @click="clearModels">
                <img src="~@/assets/img/delete.svg" />
                <span>Clear</span>
            </button>
        </div>
        <!-- <div class="slider" ref="slider">
            <div class="slides">
                <div v-for="(model, index) in $store.state.models" :key="index" class="slide">
                    <button
                        v-if="model.id == selectedModel.id"
                        class="slide selected"
                        :style="{ backgroundImage: 'url(' + model.image + ')' }"></button>
                    <button
                        v-else
                        class="slide"
                        :style="{ backgroundImage: 'url(' + model.image + ')' }"
                        @click="selectModel(model.id)"></button>
                </div>
            </div>
        </div> -->
        <swiper @swiper="onSwiperLoaded" @slideChange="onSlideChange">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
        </swiper>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Messages } from '@/messages';
import { Model } from '@/api';

import 'swiper/swiper.scss';

@Component({
    components: {
        Swiper,
        SwiperSlide,
    },
})
export default class DomOverlay extends Vue {
    private selectedModel: Model | null = null;

    @Watch('$store.state.models')
    public onModelsLoaded(): void {
        // Select first model
        const models = this.$store.state.models as Model[];
        if (models.length > 0) {
            this.selectModel(models[0].id);
        }
    }

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

    public clearModels(): void {
        this.$root.$emit(Messages.MODEL_CLEAR);
    }

    public onSwiperLoaded() {
        console.log('swiper loaded');
    }

    public onSlideChange(data: any) {
        console.log(data);
    }

    public selectModel(modelId: string): void {
        this.selectedModel = this.$store.getters.getModelById(modelId) as Model;
        this.$root.$emit(Messages.MODEL_SELECT, modelId);
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

.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
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

.slider {
    width: 100%;
    height: 120px;
    margin-top: 10px;
    margin-bottom: env(safe-area-inset-bottom, 20px);
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
