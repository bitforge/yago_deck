<template>
    <div :class="['top-bar', 'hideable', { visible: isModelFocused }]">
        <button @click="endSession" :class="['exit-button']" v-show="showBackButton">
            <span class="material-icons">arrow_back</span>
        </button>

        <h1 :class="['title', { visible: isModelFocused }]">{{ title }}</h1>

        <button @click="navigateToModelUrl" :class="['info-button', { visible: isModelFocused }]">
            <span class="material-icons">info</span>
        </button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import { Events } from '@/events';
import { Model } from '@bitforgehq/genie-api-client';

@Component
export default class TopBar extends Vue {
    public state = getModule(GlobalState, this.$store);

    public get isModelFocused(): boolean {
        return this.state.focused != null;
    }

    public get showBackButton(): boolean {
        return this.state.xrActive;
    }

    public get title(): string {
        return this.state.focused?.userData?.name || '';
    }

    public endSession(): void {
        this.$root.$emit(Events.EndXR);
    }

    public navigateToModelUrl(): void {
        if (!this.state.focused) return;
        const model = this.state.focused.userData as Model;
        if (model.siteUrl) {
            window.open(model.siteUrl, '_blank')?.focus();
            this.state.setFocused(null);
            this.$root.$emit(Events.EndXR);
        }
    }
}
</script>

<style>
.top-bar {
    --transition-timing: 0.5s;

    position: absolute;
    top: calc(env(safe-area-inset-top) + 8px);
    left: 12px;
    right: 12px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    background-color: #0000;
    transition: background-color var(--transition-timing);
    pointer-events: auto;
    border-radius: 16px;
}

.top-bar.visible {
    background-color: #000a;
}

.top-bar button {
    width: 70px;
    height: 70px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
    pointer-events: auto;
    cursor: pointer;
    background-color: transparent;
    padding: 0;
    border: none;
}

.top-bar button span {
    font-size: 32px;
}

.top-bar h1.title {
    margin: 0;
    flex-grow: 1;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    opacity: 0;
    transition: opacity var(--transition-timing);
}

.top-bar h1.title.visible {
    opacity: 1;
}

.top-bar .info-button {
    opacity: 0;
    transition: opacity var(--transition-timing);
}

.top-bar .info-button.visible {
    opacity: 1;
}
</style>
