/* eslint-disable @typescript-eslint/ban-types */
import Vue from 'vue';

// Global event bus to send messages between components
// Also helpful to decouple classes

export const MainBus: EventBus = new Vue();

export interface EventBus {
    $on(event: string | string[], callback: Function): this;
    $once(event: string | string[], callback: Function): this;
    $off(event?: string | string[], callback?: Function): this;
    $emit(event: string, ...args: any[]): this;
}

export enum Messages {
    MODELS_LOADED = 'MODELS_LOADED',
    LAUNCH_XR_SESSION = 'LAUNCH_XR_SESSION',
}
