<template>
    <div class="toolbar">
        <toolbar-button
            icon="undo"
            text="Undo"
            @click="unplaceModel"
            :hideable="true"
            :disabled="disableDeleteButtons" />
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
            :disabled="disableDeleteButtons" />
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

    public get disableDeleteButtons(): boolean {
        // Buttons are enabled when any model is placed
        return this.state.placed.length == 0;
    }

    /** Remove last placed model */
    public unplaceModel(): void {
        this.state.unplaceModel();
        this.$root.$emit(Events.UnplaceModel);
    }

    /** Hide most UI elements only view content */
    public enableViewOnlyMode(): void {
        this.state.setViewOnlyMode(true);
    }

    /** Show all UI Elements again */
    public disableViewOnlyMode(): void {
        this.state.setViewOnlyMode(false);
    }

    /** Remova ALL placed models */
    public showCart(): void {
        alert('Not implemented yet. 🙇‍♀️');
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
