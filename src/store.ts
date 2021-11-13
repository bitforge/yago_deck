import Vue from 'vue';
import Vuex from 'vuex';
import { Model } from '@/api';

Vue.use(Vuex);

const state: MainState = {
    // True when WebXR is supported
    xrSupported: false,
    // True when WebXR session is active
    xrActive: false,
    // True when only models are visible
    viewOnlyMode: false,
    // Loaded model infos from api
    models: [],
};

export default new Vuex.Store({
    state,
    mutations: {
        setXRSupported(state: MainState, xrSupported: boolean): void {
            state.xrSupported = xrSupported;
        },
        setXRActive(state: MainState, xrActive: boolean): void {
            state.xrActive = xrActive;
        },
        setViewOnlyMode(state: MainState, viewOnlyMode: boolean): void {
            state.viewOnlyMode = viewOnlyMode;
        },
        setModels(state: MainState, models: Model[]): void {
            state.models = models;
        },
    },
    getters: {
        getModelById: (state: MainState) => (id: string) => {
            return state.models.find(model => model.id === id);
        },
    },
    actions: {},
    modules: {},
});

interface MainState {
    xrSupported: boolean;
    xrActive: boolean;
    viewOnlyMode: boolean;
    models: Model[];
}
