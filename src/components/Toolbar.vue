<template>
    <!-- I'd like to have all of this indented -->
    <!-- prettier-ignore -->
    <div class="toolbar">
        <div class="left hideable">
            <toolbar-button
                v-show="!state.focused"
                icon="undo"
                text="Unplace"
                @click="unplaceModel"
                :disabled="state.placed.length == 0" />
            <toolbar-button
                v-show="state.focused"
                icon="delete"
                text="Remove"
                @click="deleteModel"
                :disabled="false" />
        </div>
        <div class="center">
            <toolbar-button
                v-show="!state.viewOnlyMode"
                icon="visibility"
                @click="enableViewOnlyMode" />
            <toolbar-button
                v-show="state.viewOnlyMode"
                icon="camera"
                @click="takeScreenshot" />
            <toolbar-button
                v-show="state.viewOnlyMode"
                icon="expand_less"
                :small="true"
                @click="disableViewOnlyMode" />
        </div>
        <div class="right hideable">
            <toolbar-button
                icon="shopping_cart"
                text="Cart"
                :cartBadge="true"
                @click="showCart"
                :disabled="state.placed.length == 0" />
        </div>
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

    /** Remove last placed model */
    public unplaceModel(): void {
        this.$root.$emit(Events.UnplaceModel);
    }

    /** Remove focused model */
    public deleteModel(): void {
        this.$root.$emit(Events.RemoveModel, this.state.focused);
    }

    /** Hides most UI elements to view placed models only */
    public enableViewOnlyMode(): void {
        this.state.setViewOnlyMode(true);
    }

    /** Show all UI elements again */
    public disableViewOnlyMode(): void {
        this.state.setViewOnlyMode(false);
    }

    /** Take Screenshot of current view */
    public takeScreenshot(): void {
        throw new Error('Not implemented yet');
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

.toolbar .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 8px;
}
</style>
