<template>
    <div class="cart-item">
        <img :src="item.model.imageThumb" :alt="item.model.name" />
        <h3 class="title">{{ item.model.name }}</h3>
        <input type="number" min="1" max="10" :value="item.quantity" class="quantity" />
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
    padding: 4px 0;
}

.cart-item img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    object-fit: contain;
}

.cart-item .title {
    flex-grow: 1;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.cart-item .quantity {
    max-width: 50px;
    height: 30px;
    padding: 10px;
    border: none;
    font-size: 18px;
}

</style>
