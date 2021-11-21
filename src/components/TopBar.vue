<template>
    <div class="top-bar">
        <button @click="endSession" class="exit-button">
            <span class="material-icons">arrow_back</span>
        </button>
        <h1>{{ title }}</h1>
        <button @click="deleteModel" class="delete-button">
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
    public title = '';

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
        this.title = this.focusModel.userData.name;
    }

    public onModelUnfocused(): void {
        this.focusModel = null;
        this.title = '';
    }

    public endSession(): void {
        this.$root.$emit(Events.EndXR);
    }

    public deleteModel(): void {
        // Not implemented yet
    }
}
</script>

<style>
.top-bar {
    position: absolute;
    top: calc(env(safe-area-inset-top) + 8px);
    left: 12px;
    right: 12px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    background-color: #000a;
    pointer-events: auto;
    border-radius: 16px;
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

.top-bar h1 {
    margin: 0;
    flex-grow: 1;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}
</style>
