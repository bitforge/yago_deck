<template>
    <div class="swiper hideable">
        <div class="swiper-wrapper">
            <div v-for="(model, index) in $store.state.models" :key="index" class="swiper-slide">
                <h2>{{ model.name }}</h2>
                <img :src="model.image" :alt="model.name" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Messages } from '@/messages';
import { Model } from '@/api';

// Unfortunately, Swiper.js 7 Component for Vue is uterly broken.
// Specifically, it's Vue 3 only Vue can't load ESM packages yet.
// Therefore, Swiper is included manually and we rolled up our
// own component manually for the fancy cards effect.
// This doesn't have type support though so check:
// https://swiperjs.com/swiper-api

@Component
export default class ModelCards extends Vue {
    private swiper: any | null = null;

    public mounted(): void {
        // @ts-ignore
        this.swiper = new Swiper('.swiper', {
            effect: 'cards',
            grabCursor: true,
        });

        // Attach swiper events
        this.swiper.on('slideChange', this.onSlideChanged);
        this.swiper.on('tap', this.onSliderTapped);
    }

    @Watch('$store.state.models')
    public async onModelsLoaded(): Promise<void> {
        await this.$nextTick();
        if (this.$store.state.models.length > 0) {
            this.swiper?.update();
            this.selectFirstModel();
        }
    }

    private selectFirstModel(): void {
        const models = this.$store.state.models as Model[];
        if (models.length > 0) {
            this.$root.$emit(Messages.MODEL_SELECT, models[0].id);
        }
    }

    private onSlideChanged() {
        const index = this.swiper.activeIndex;
        const model = this.$store.state.models[index];
        if (!model) return;
        this.$root.$emit(Messages.MODEL_SELECT, model.id);
    }

    private onSliderTapped() {
        const index = this.swiper.activeIndex;
        const model = this.$store.state.models[index];
        if (!model) return;
        this.$root.$emit(Messages.MODEL_PLACE, model.id);
    }
}
</script>

<style>
.swiper {
    width: 180px;
    height: 180px;
}

.swiper-slide {
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.swiper-slide h2 {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    font-size: 16px;
    margin: 0;
    padding: 8px 4px;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 5px #222;

}

/* Distinct color set from Sasha Trubetskoy: */
/* https://sashamaps.net/docs/resources/20-colors/ */

/* Red */
.swiper-slide:nth-child(1n) h2 {
    background-color: #e6194baa;
}

/* Orange */
.swiper-slide:nth-child(2n) h2{
    background-color: #f58231aa;
}

/* Yellow */
.swiper-slide:nth-child(3n) h2 {
    background-color: #ffe119aa;
}

/* Lime */
.swiper-slide:nth-child(4n) h2 {
    background-color: #bfef45aa;
}

/* Green */
.swiper-slide:nth-child(5n) h2 {
    background-color: #3cb44baa;
}

/* Cyan */
.swiper-slide:nth-child(6n) h2 {
    background-color: #42d4f4aa;
}

/* Blue */
.swiper-slide:nth-child(7n) h2 {
    background-color: #4363d8aa;
}

/* Purple */
.swiper-slide:nth-child(8n) h2 {
    background-color: #911eb4aa;
}

/* Magenta */
.swiper-slide:nth-child(9n) h2 {
    background-color: #f032e6aa;
}

/* Grey */
.swiper-slide:nth-child(10n) h2 {
    background-color: #a9a9a9aa;
}

.swiper-slide img {
    width: 160px;
    height: 160px;
    object-fit: contain;
}
</style>
