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
    mutations: {},
    actions: {},
    modules: {},
});

interface MainState {
    xrSupported: boolean;
    xrActive: boolean;
    models: Model[];
}
