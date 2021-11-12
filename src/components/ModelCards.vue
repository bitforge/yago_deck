<template>
    <div class="swiper">
        <div class="swiper-wrapper">
            <div v-for="(model, index) in $store.state.models" :key="index" class="swiper-slide">
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
    align-items: center;
    justify-content: center;
}

.swiper-slide img {
    width: 170px;
    height: 170px;
    object-fit: contain;
}
</style>
