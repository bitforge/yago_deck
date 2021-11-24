<template>
    <transition name="modal-fade">
        <div class="modal-wrapper">
            <div class="modal">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {}
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.5s;
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;

    padding: 16px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background-color: #000a;
    box-shadow: 0px 0px 20px #0009;
    border-radius: 16px;
    padding: 8px 16px;
    font-size: 18px;
    color: white;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal img {
    max-width: 100%;
}
</style>
