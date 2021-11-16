<template>
    <div class="models-deck">
        <div class="swiper hideable">
            <div class="swiper-wrapper">
                <model-card :model="model" v-for="(model, index) in state.models" :key="index" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import ModelCard from '@/components/ModelCard.vue';
import { Events } from '@/events';
import { Model } from '@bitforgehq/genie-api-client';

// Unfortunately, Swiper.js 7 Component for Vue is uterly broken.
// Specifically, it's Vue 3 only Vue can't load ESM packages yet.
// Therefore, Swiper is included manually and we rolled up our
// own component manually for the fancy cards effect.
// This doesn't have type support though so check:
// https://swiperjs.com/swiper-api

@Component({
    components: {
        ModelCard,
    },
})
export default class ModelsDeck extends Vue {
    private state = getModule(GlobalState, this.$store);
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

    public beforeDestory(): void {
        // Detach swiper events
        this.swiper.off('slideChange', this.onSlideChanged);
        this.swiper.off('tap', this.onSliderTapped);
    }

    @Watch('state.models')
    public async onModelsLoaded(): Promise<void> {
        await this.$nextTick();
        if (this.state.models.length > 0) {
            this.swiper?.update();
            this.selectFirstModel();
        }
    }

    @Watch('state.viewOnlyMode')
    public onViewOnlyModeChanged(): void {
        if (this.state.viewOnlyMode) {
            this.swiper.disable();
        } else {
            this.swiper.enable();
        }
    }

    private selectFirstModel(): void {
        const models = this.state.models as Model[];
        if (models.length > 0) {
            this.$root.$emit(Events.SelectModel, models[0].id);
        }
    }

    private onSlideChanged() {
        const index = this.swiper.activeIndex;
        const model = this.state.models[index];
        if (!model) return;
        this.$root.$emit(Events.SelectModel, model.id);
    }

    private onSliderTapped() {
        const index = this.swiper.activeIndex;
        const model = this.state.models[index];
        if (!model) return;
        this.state.placeModel(model);
        this.$root.$emit(Events.PlaceModel, model.id);
    }
}
</script>

<style>
.models-deck {
    height: 235px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
}

.swiper {
    width: 180px;
    height: 180px;
}
</style>
