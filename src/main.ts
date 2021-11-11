import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { MainBus } from '@/Messaging';
import '@/types';

Vue.config.productionTip = false;

Vue.prototype.$bus = MainBus;

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
