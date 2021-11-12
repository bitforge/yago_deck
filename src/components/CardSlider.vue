<template>
    <div class="swiper">
        <div class="swiper-wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CardSlider extends Vue {
    public mounted(): void {
        console.log('mounted');
    }
}
</script>

<style>
.swiper {
    width: 400px;
    height: 400px;
}
</style>
