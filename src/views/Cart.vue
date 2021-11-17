<template>
    <div class="cart-overlay">
        <div class="cart">
            <header>
                <span @click="onClose" class="close-button material-icons">close</span>
            </header>
            <section class="items">
                <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
                    <h3>{{ item.model.name }}</h3>
                    <h4>{{ item.count }}</h4>
                </div>
            </section>
            <footer>
                <button class="checkout">Checkout</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import { randInt } from 'three/src/math/MathUtils';
import { Model } from '@bitforgehq/genie-api-client';
import CartItem from '@/cart/CartItem';

@Component
export default class Cart extends Vue {
    private state = getModule(GlobalState, this.$store);

    @Watch('state.models')
    public testFillCart(): void {
        for (const model of this.state.models) {
            const count = randInt(0, 3);
            for (let i = 0; i < count; i++) {
                this.state.placeModel(model);
            }
        }
    }

    public get cartItems(): CartItem[] {
        const cartBuilder = new Map<Model, number>();
        for (const model of this.state.placed) {
            if (!cartBuilder.has(model)) {
                cartBuilder.set(model, 1);
            } else {
                const count = cartBuilder.get(model);
                if (count) cartBuilder.set(model, count + 1);
            }
        }

        const cartItems = new Array<CartItem>();
        for (const [model, count] of cartBuilder) {
            cartItems.push(new CartItem(model, count));
        }

        return cartItems;
    }

    public onClose(): void {
        this.state.setShowCart(false);
    }
}
</script>

<style>
.cart-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: all;

    display: flex;
    align-items: stretch;
    justify-content: center;

    background-color: #0002;
    z-index: 1000;
    padding: 16px 0 112px 0;
}

.cart {
    height: 85vh;
    width: 90vw;
    min-width: 320px;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;

    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 50px #000;
}

.cart header {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
}

.cart .close-button {
    font-size: 32px;
    color: #000;
}

.cart section.items {
    flex-grow: 1;
    padding: 8px;
}

.cart footer {
    padding: 16px;
}

.cart button.checkout {
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    background-color: #000;
    color: white;
    border-radius: 4px;
    border: none;
    padding: 8px;
}
</style>
