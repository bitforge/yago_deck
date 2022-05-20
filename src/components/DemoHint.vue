<template>
    <div class="demo-hint">
        <div class="demo-dialog">
            <p>Not part of this demo (yet).</p>
            <button @click="onClose">Okay 🤷‍♂️</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';

@Component
export default class DemoHint extends Vue {
    private state = getModule(GlobalState, this.$store);

    public onClose(): void {
        this.state.setShowDemoHint(false);
    }
}
</script>

<style>
.demo-hint {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: all;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #0002;
    z-index: 1000;
    padding-top: calc(env(safe-area-inset-top) + 8px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
}

.demo-dialog {
    background-color: white;
    border-radius: 16px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 20px 1px #838383;
    font-size: 18px;
    padding: 32px;
}

.demo-dialog button {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    background-color: #000;
    color: white;
    border-radius: 4px;
    border: none;
    padding: 12px;
}
</style>
