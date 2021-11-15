import Vue from 'vue';
import Vuex from 'vuex';
import GlobalState from '@/store/GlobalState';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    modules: {
        global: GlobalState,
    },
});
