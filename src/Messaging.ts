import Vue from 'vue';

// Global event bus to send messages between components
// Also helpful to decouple classes

export const EventBus = new Vue();

export enum Messages {
    MODELS_LOADED = 'MODELS_LOADED',
    LAUNCH_XR_SESSION = 'LAUNCH_XR_SESSION',
}
