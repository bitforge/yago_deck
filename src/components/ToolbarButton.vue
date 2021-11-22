<template>
    <button @click="onClick" :class="{ 'toolbar-button': true, hideable: hideable, disabled: disabled }">
        <span class="material-icons primary">{{ icon }}</span>
        <span :class="{ 'material-icons': action, secondary: true }">{{ action || text }}</span>
        <span class="badge" v-if="showBadge">{{ badgeCount }}</span>
    </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import GlobalState from '@/store/GlobalState';

@Component
export default class ToolbarButton extends Vue {
    private state = getModule(GlobalState, this.$store);

    @Prop({ default: 'home' })
    public icon!: string;

    @Prop({ default: '?' })
    public text!: string;

    @Prop({ default: '' })
    public action!: string;

    @Prop({ default: false })
    public cartBadge!: boolean;

    @Prop({ default: false })
    public disabled!: boolean;

    @Prop({ default: true })
    public hideable!: boolean;

    public get showBadge(): boolean {
        return this.cartBadge && this.state.placed.length > 0;
    }

    public get badgeCount(): number {
        return this.state.placed.length;
    }

    public onClick(): void {
        if (!this.disabled) {
            this.$emit('click');
        }
    }
}
</script>

<style>
.toolbar-button {
    position: relative;
    width: 70px;
    height: 70px;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.toolbar-button.disabled {
    color: #fff9;
}

.toolbar-button span.primary {
    font-size: 24px;
}

.toolbar-button span.secondary {
    font-size: 14px;
}

.toolbar-button .material-icons:nth-child(1) {
    margin: 4px;
}

.toolbar-button .badge {
    position: absolute;
    left: -16px;
    top: -16px;
    width: 20px;
    height: 20px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 6px;
}
</style>
