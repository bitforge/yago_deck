<template>
    <div class="cart-overlay">
        <div class="cart">
            <header>
                <h2>Your cart</h2>
                <span @click="onClose" class="close-button material-icons">close</span>
            </header>
            <section class="items">
                <cart-item v-for="(lineItem, index) in cart.lineItems" :key="index" :item="lineItem" />
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
import Cart from '@/cart/Cart';
import CartItem from '@/components/CartItem.vue';

@Component({
    components: {
        CartItem,
    },
})
export default class CartView extends Vue {
    private state = getModule(GlobalState, this.$store);

    public cart = new Cart();

    @Watch('state.models')
    public testFillCart(): void {
        if (!this.state.devMode) return;
        for (const model of this.state.models) {
            const count = randInt(0, 3);
            for (let i = 0; i < count; i++) {
                this.state.placeModel(model);
            }
        }
    }

    @Watch('state.placed')
    public updateCart(): void {
        this.cart.updateModels(this.state.placed);
        console.log(this.cart.lineItems.length);
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
    padding-top: calc(env(safe-area-inset-top) + 8px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
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
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
}

.cart header h2 {
    margin: 0;
}

.cart .close-button {
    font-size: 32px;
    color: #000;
}

.cart section.items {
    flex-grow: 1;
    padding: 8px;
    overflow-y: scroll;
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
