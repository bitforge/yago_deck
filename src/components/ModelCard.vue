<template>
    <div class="swiper-slide">
        <h2>{{ model.name }}</h2>
        <img :src="model.image" :alt="model.name" />
        <h3 class="price">{{ displayPrice }}</h3>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Model } from '@bitforgehq/genie-api-client';

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
    text-shadow: 1px 1px 5px #222;
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
    font-size: 18px;
    background-color: #fff9;
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
