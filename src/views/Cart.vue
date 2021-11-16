<template>
    <div class="cart-overlay">
        <div class="cart">
            <header>
                <span @click="onClose" class="close-button material-icons">close</span>
            </header>
            <section class="items">
                <p>Empty cart</p>
            </section>
            <footer>
                <button class="checkout">Checkout</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';

@Component
export default class Cart extends Vue {
    private state = getModule(GlobalState, this.$store);

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
    min-width: 80vw;
    min-height: 80vh;
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
