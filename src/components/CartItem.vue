<template>
    <div class="cart-item">
        <p class="quantity">{{ item.quantity }}×</p>
        <img :src="item.model.imageThumb" :alt="item.model.name" />
        <h3 class="title">{{ item.model.name }}</h3>
        <p class="price">{{ item.priceDisplay }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LineItem from '@/cart/LineItem';

@Component
export default class ModelCard extends Vue {
    @Prop()
    public item!: LineItem;
}
</script>

<style>
.cart-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 4px;
}

.cart-item .quantity {
    width: 18px;
    padding: 4px;
    font-size: 18px;
}

.cart-item img {
    width: 52px;
    height: 52px;
    padding: 4px;
    margin-right: 10px;
    object-fit: contain;
}

.cart-item .title {
    flex-grow: 1;
    font-size: 16px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.cart-item .price {
    min-width: 80px;
    padding: 4px 8px;
    font-weight: bold;
    font-size: 18px;
}
</style>
