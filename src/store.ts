import Vue from 'vue';
import Vuex from 'vuex';
import { Model } from '@/api';

Vue.use(Vuex);

const state: MainState = {
    xrSupported: false,
    xrActive: false,
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
    models: Model[];
}
