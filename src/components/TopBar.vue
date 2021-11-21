<template>
    <div class="top-bar">
        <button @click="endSession" class="exit-button">
            <span class="material-icons">arrow_back</span>
        </button>
        <h1>{{ title }}</h1>
        <button @click="endSession" class="delete-button">
            <span class="material-icons">delete</span>
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

    public title = 'Philondendron';

    public endSession(): void {
        this.$root.$emit(Events.EndXR);
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
    font-size: 32px;
    font-weight: bold;
    color: #fff;
}
</style>
