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
        <div class="model-slider">
            <vue-slick-carousel
                ref="slick"
                v-bind="slickOptions"
                @afterChange="onSlideChanged"
                v-if="$store.state.models.length > 0">
                <div v-for="(model, index) in $store.state.models" :key="index" class="model">
                    <img :src="model.image" :alt="model.name" />
                </div>
            </vue-slick-carousel>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Messages } from '@/messages';
import { Model } from '@/api';

// Ugly but functional slider component
// @ts-ignore
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

@Component({
    components: {
        VueSlickCarousel,
    },
})
export default class DomOverlay extends Vue {
    private selectedModel: Model | null = null;

    public slickOptions = {
        arrows: true,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 5,
    };

    @Watch('$store.state.models')
    public onModelsLoaded(): void {
        // Select first model
        const models = this.$store.state.models as Model[];
        if (models.length > 0) {
            this.selectModel(models[0].id);
        }
    }

    private onInitCarousel() {
        console.log('our carousel is ready');
        console.log(this.$store.state.models);
    }

    public onSlideChanged(slideIndex: number): void {
        console.log('Slide changed:', slideIndex);
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

.model-slider {
    display: flex;
    justify-content: center;
    align-items: center;
}

.slick-slider {
    height: 300px;
    width: 900px;
    background-color: white;
    border-radius: 16px;
}

.slick-slider .model {
    width: 260px;
    height: 260px;
    padding: 20px;
}

.slick-slider .model img {
    width: 260px;
    height: 260px;
}
</style>
