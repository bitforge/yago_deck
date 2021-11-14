<template>
    <button @click="onClick" :class="{ 'toolbar-button': true, hideable: hideable, disabled: disabled }">
        <span class="material-icons">{{ icon }}</span>
        <span :class="{ 'material-icons': action }">{{ action || text }}</span>
    </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ToolbarButton extends Vue {
    @Prop({ default: 'home' })
    public icon!: string;

    @Prop({ default: '?' })
    public text!: string;

    @Prop({ default: '' })
    public action!: string;

    @Prop({ default: false })
    public disabled!: boolean;

    @Prop({ default: true })
    public hideable!: boolean;

    public onClick(): void {
        this.$emit('click');
    }
}
</script>

<style>
.toolbar-button {
    width: 70px;
    height: 70px;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.3);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.toolbar-button.disabled {
    color: #fff9;
}

.toolbar-button span:nth-child(1) {
    font-size: 24px;
}

.toolbar-button span:nth-child(2) {
    font-size: 14px;
}

.toolbar-button .material-icons:nth-child(1) {
    margin: 4px;
}
</style>
