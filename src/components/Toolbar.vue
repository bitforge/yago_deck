<template>
    <div class="toolbar">
        <toolbar-button
            icon="refresh"
            text="Reset"
            @click="clearModels"
            :hideable="true"
            :disabled="noModelPlacedInScene" />
        <toolbar-button
            v-show="!state.viewOnlyMode"
            icon="style"
            action="expand_more"
            @click="enableViewOnlyMode"
            :hideable="false" />
        <toolbar-button
            v-show="state.viewOnlyMode"
            icon="expand_less"
            action="style"
            @click="disableViewOnlyMode"
            :hideable="false" />
        <toolbar-button
            icon="shopping_cart"
            text="Cart"
            :cartBadge="true"
            @click="showCart"
            :hideable="true"
            :disabled="noModelPlacedInScene" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';
import ToolbarButton from '@/components/ToolbarButton.vue';
import { Events } from '@/events';

@Component({
    components: {
        ToolbarButton,
    },
})
export default class Toolbar extends Vue {
    private state = getModule(GlobalState, this.$store);

    /* Toggles visbility of remove last and show cart buttons */
    public get noModelPlacedInScene(): boolean {
        return this.state.placed.length == 0;
    }

    /** Remove last placed model */
    public clearModels(): void {
        this.state.clearPlaced();
        this.$root.$emit(Events.ClearPlaced);
    }

    /** Hides most UI elements to view placed models only */
    public enableViewOnlyMode(): void {
        this.state.setViewOnlyMode(true);
    }

    /** Show all UI elements again */
    public disableViewOnlyMode(): void {
        this.state.setViewOnlyMode(false);
    }

    /** Show current place models cart */
    public showCart(): void {
        this.state.setShowCart(true);
    }
}
</script>

<style>
.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    pointer-events: auto;
    padding: 12px;
    z-index: 150;
}
</style>
