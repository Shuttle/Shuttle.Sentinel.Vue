import Vue from 'vue';
import Vuex from 'vuex';
import Alerts from './alerts';
import access from './access';
import api from './api';
import router from './router'
import i18n from './i18n';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        starting: true,
        working: false,
        alerts: new Alerts(),
        authenticated: false,
        secondaryNavbarItems: [],
        theme: localStorage.getItem('theme') || 'dark'
    },
    getters: {
        authenticated: state => {
            return state.authenticated;
        },
        secondaryNavbarItems: state => {
            return state.secondaryNavbarItems;
        },
        theme: state => {
            return state.theme;
        }
    },
    mutations: {
        STARTED: state => state.starting = false,
        START_WORKING: state => state.working = true,
        STOP_WORKING: state => state.working = false,
        ADD_ALERT: (state, alert) => {
            state.alerts.add(alert);
        },
        REMOVE_ALERT: (state, alert) => {
            state.alerts.remove(alert);
        },
        AUTHENTICATED: state => state.authenticated = true,
        LOGGED_OUT: state => state.authenticated = false,
        ADD_SECONDARY_NAVBAR_ITEM: (state, item) => {
            state.secondaryNavbarItems.push(item);
        },
        CLEAR_SECONDARY_NAVBAR_ITEMS: (state) => {
            state.secondaryNavbarItems = [];
        },
        APPLY_THEME: (state, { theme }) => {
            if (state.theme === theme) {
                return;
            }

            state.theme = theme;

            router.go();
        },
    },
    actions: {
        login({ commit }, payload) {
            commit('START_WORKING');

            return new Promise((resolve, reject) => {
                api.get("profiles/identity/" + payload.email)
                    .then((response) => {
                        access.login({
                            identityName: response.data.identityName,
                            password: payload.password
                        })
                            .then(() => {
                                commit('AUTHENTICATED');
                                commit('STOP_WORKING');
                                resolve();
                            })
                            .catch(error => { reject(error); });
                    })
                    .finally(() => {
                        commit('STOP_WORKING');

                    })
            });
        },
        logout({ commit }) {
            access.logout();
            commit('LOGGED_OUT');
        },
        addAlert({ commit }, alert) {
            commit('ADD_ALERT', alert);
        },
        requestSent({ commit }) {
            commit('ADD_ALERT', {
                message: i18n.t("messages.request-sent"),
            });
        },
        addSecondaryNavbarItem({ commit }, item) {
            if (!item.click || typeof item.click !== "function") {
                throw new Error("Secondary navbar item does not have a 'click' method defined.")
            }

            if (item.permission && !access.hasPermission(item.permission)) {
                return;
            }

            commit('ADD_SECONDARY_NAVBAR_ITEM', item);
        },
        clearSecondaryNavbarItems({ commit }) {
            commit('CLEAR_SECONDARY_NAVBAR_ITEMS');
        },
        toggleTheme({ commit }) {
            let theme = this.state.theme;

            if (theme === "dark") {
                theme = "light";
            } else {
                theme = "dark";
            }

            commit('APPLY_THEME', {
                theme
            });
        },
    }
})
