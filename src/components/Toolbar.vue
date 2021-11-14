<template>
    <div class="toolbar">
        <toolbar-button
            icon="undo"
            text="Undo"
            @click="unplaceModel"
            :hideable="true"
            :disabled="disableDeleteButtons" />
        <toolbar-button
            v-show="!$store.state.viewOnlyMode"
            icon="style"
            action="expand_more"
            @click="enableViewOnlyMode"
            :hideable="false" />
        <toolbar-button
            v-show="$store.state.viewOnlyMode"
            icon="expand_less"
            action="style"
            @click="disableViewOnlyMode"
            :hideable="false" />
        <toolbar-button
            icon="delete"
            text="Clear"
            @click="clearModels"
            :hideable="true"
            :disabled="disableDeleteButtons" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ToolbarButton from '@/components/ToolbarButton.vue';
import { Events } from '@/events';
import { Actions } from '@/store';

@Component({
    components: {
        ToolbarButton,
    },
})
export default class Toolbar extends Vue {
    public get disableDeleteButtons(): boolean {
        // Buttons are enabled when a model is placed
        return this.$store.state.placed.length == 0;
    }

    /** Remove last placed model */
    public unplaceModel(): void {
        this.$store.commit(Actions.UnplaceModel);
        this.$root.$emit(Events.UnplaceModel);
    }

    /** Hide most UI elements only view content */
    public enableViewOnlyMode(): void {
        this.$store.commit(Actions.SetViewOnlyMode, true);
    }

    /** Show all UI Elements again */
    public disableViewOnlyMode(): void {
        this.$store.commit(Actions.SetViewOnlyMode, false);
    }

    /** Remova ALL placed models */
    public clearModels(): void {
        this.$store.commit(Actions.ClearPlaced);
        this.$root.$emit(Events.ClearPlaced);
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
