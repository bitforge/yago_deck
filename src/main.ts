import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

// Include swiper scss
import 'swiper/swiper.scss';

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
