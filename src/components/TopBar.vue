<template>
    <div :class="['top-bar', 'hideable', { visible: isVisible }]">
        <button @click="endSession" :class="['exit-button']" v-show="showBackButton">
            <span class="material-icons">arrow_back</span>
        </button>

        <h1 :class="['title', { visible: isVisible }]">{{ title }}</h1>

        <button @click="deleteModel" :class="['delete-button', { visible: isVisible }]">
            <span class="material-icons">delete</span>
        </button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import { Events } from '@/events';
import * as THREE from 'three';

@Component
export default class TopBar extends Vue {
    public state = getModule(GlobalState, this.$store);
    public focusModel: THREE.Object3D | null = null;

    public get isVisible(): boolean {
        return this.focusModel != null;
    }

    public get showBackButton(): boolean {
        return this.state.xrActive;
    }

    public get title(): string {
        return this.focusModel?.userData?.name || '';
    }

    public mounted(): void {
        this.$root.$on(Events.FocusedModel, this.onModelFocused);
        this.$root.$on(Events.UnfocusedModel, this.onModelUnfocused);
    }

    public beforeDestroy(): void {
        this.$root.$off(Events.FocusedModel, this.onModelFocused);
        this.$root.$off(Events.UnfocusedModel, this.onModelUnfocused);
    }

    public onModelFocused(object: THREE.Object3D): void {
        this.focusModel = object;
    }

    public onModelUnfocused(): void {
        this.focusModel = null;
    }

    public endSession(): void {
        this.$root.$emit(Events.EndXR);
    }

    public deleteModel(): void {
        this.$root.$emit(Events.UnplaceModel, this.focusModel);
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

.top-bar .delete-button {
    opacity: 0;
    transition: opacity var(--transition-timing);
}

.top-bar .delete-button.visible {
    opacity: 1;
}
</style>
