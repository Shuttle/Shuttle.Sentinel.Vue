import Vue from 'vue';
import store from './store';
import App from './App.vue';
import i18n from './i18n'
import BootstrapVue from 'bootstrap-vue';
import "vue-multiselect/dist/vue-multiselect.min.css";
import ShuttleVue from 'shuttle-vue';
import Vuelidate from 'vuelidate';
import Multiselect from 'vue-multiselect'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleUp, faCircleNotch, faClone, faEdit, faExternalLinkAlt, faEye, faEyeSlash, faKey, faMoon, faHourglass, faSignOutAlt, faUser, faPlusSquare, faShieldAlt, faSyncAlt, faSun, faTimes, faTrashAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router'
import access from './access';
import api from './api';

library.add(faAngleDown, faAngleUp, faCircleNotch, faClone, faEdit, faExternalLinkAlt, faEye, faEyeSlash, faKey, faMoon, faHourglass, faSignOutAlt, faUser, faPlusSquare, faShieldAlt, faSyncAlt, faSun, faTimes, faTrashAlt, faUserCircle);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('multiselect', Multiselect);

Vue.use(BootstrapVue);
Vue.use(ShuttleVue);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

Vue.prototype.$api = api;
Vue.prototype.$access = access;

var vue = new Vue({
    store,
    router,
    i18n,
    access,
    render: h => h(App),
}).$mount('#app');

if (vue.$store.state.theme === "dark") {
    require("@/assets/bootstrap-dark.scss");
} else {
    require("@/assets/bootstrap-light.scss");
}

access.initialize()
    .then(() => {
        if (access.loginStatus === 'logged-in') {
            store.commit('AUTHENTICATED');
        }
    })
    .catch(function () {
        store.dispatch('addAlert', {
            message: i18n.t('exceptions.access-failure'),
            type: 'danger',
            expire: false
        });
    })
    .finally(function () {
        store.commit('STARTED');

        if (window.location.pathname !== "/") {
            router.push({ path: window.location.pathname + window.location.search });
        } else {
            if (access.loginStatus !== 'logged-in') {
                router.push({ path: "/login" });
            }
        }
    });
