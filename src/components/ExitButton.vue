<template>
    <button @click="endSession" class="exit-button">
        <span class="material-icons">close</span>
    </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Events } from '@/events';

@Component
export default class ExitButton extends Vue {
    public endSession(): void {
        this.$root.$emit(Events.EndXR);
    }
}
</script>

<style>
.exit-button {
    position: absolute;
    top: env(safe-area-inset-top);
    right: 0;
    width: 70px;
    height: 70px;

    display: flex;
    align-items: center;
    justify-content: center;

    pointer-events: auto;
    color: white;
    background-color: transparent;
    padding: 8px;
    border: none;
    border-radius: 4px;
}

.exit-button span {
    font-size: 32px;
}
</style>
