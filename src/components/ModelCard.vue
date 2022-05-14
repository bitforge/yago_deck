<template>
    <div class="swiper-slide">
        <h2>{{ model.name }}</h2>
        <img :src="model.imagePreview" :alt="model.name" />
        <h3 class="price">{{ displayPrice }}</h3>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Model } from '@bitforgehq/yago-api-client';

@Component
export default class ModelCard extends Vue {
    @Prop()
    public model!: Model;

    public get displayPrice(): string {
        if (!this.model.price || !this.model.priceCurrency) return 'XX.- CHF';
        return `${this.model.price} ${this.model.priceCurrency}`;
    }
}
</script>

<style>
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
    top: 0;
    right: 0;
    left: 0;
    font-size: 16px;
    margin: 0;
    padding: 8px 4px;
    color: #fff;
    font-weight: bold;
    text-shadow: 0px 0px 4px #000;
}

.swiper-slide h3.price {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 8px;
    color: #000;
    text-align: center;
    font-size: 16px;
    background-color: #fff9;
}

/* Distinct color set from Sasha Trubetskoy: */
/* https://sashamaps.net/docs/resources/20-colors/ */

/* Red */
.swiper-slide:nth-child(10n + 1) {
    background-color: #e6194b;
}

/* Orange */
.swiper-slide:nth-child(10n + 2) {
    background-color: #f58231;
}

/* Yellow */
.swiper-slide:nth-child(10n + 3) {
    background-color: #ffe119;
}

/* Lime */
.swiper-slide:nth-child(10n + 4) {
    background-color: #bfef45;
}

/* Green */
.swiper-slide:nth-child(10n + 5) {
    background-color: #3cb44b;
}

/* Cyan */
.swiper-slide:nth-child(10n + 6) {
    background-color: #42d4f4;
}

/* Blue */
.swiper-slide:nth-child(10n + 7) {
    background-color: #4363d8;
}

/* Purple */
.swiper-slide:nth-child(10n + 8) {
    background-color: #911eb4;
}

/* Magenta */
.swiper-slide:nth-child(10n + 9) {
    background-color: #f032e6;
}

/* Grey */
.swiper-slide:nth-child(10n) {
    background-color: #a9a9a9;
}

.swiper-slide img {
    width: 160px;
    height: 160px;
    object-fit: contain;
}
</style>
