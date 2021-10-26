import Vue from 'vue'
import Router from 'vue-router'
import access from './access';
import store from './store';
import i18n from './i18n';
import Permissions from './permissions';

Vue.use(Router)

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue")
        },
        {
            path: "/datastores",
            name: "datastores",
            component: () => import(/* webpackChunkName: "datastores" */ "./views/DataStores.vue"),
            meta: {
                permission: Permissions.View.DataStores
            }
        },
        {
            path: "/datastore",
            name: "datastore",
            component: () => import(/* webpackChunkName: "datastore" */ "./views/DataStore.vue"),
            meta: {
                permission: Permissions.Manage.DataStores
            }
        },
        {
            path: "/endpoints",
            name: "endpoints",
            component: () => import(/* webpackChunkName: "endpoints" */ "./views/Endpoints.vue"),
            meta: {
                permission: Permissions.View.Monitoring
            }
        },
        {
            path: "/login",
            name: "login",
            component: () => import(/* webpackChunkName: "login" */ "./views/Login.vue")
        },
        {
            path: "/register",
            name: "register",
            component: () => import(/* webpackChunkName: "register" */ "./views/Register.vue")
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import(/* webpackChunkName: "profile" */ "./views/Profile.vue"),
            meta: {
                requiresAuthentication: true
            }
        },
        {
            path: "/forgotpassword",
            name: "forgotpassword",
            component: () => import(/* webpackChunkName: "forgotpassword" */ "./views/ForgotPassword.vue")
        },
        {
            path: "/resetpassword/:token",
            name: "resetpassword",
            component: () => import(/* webpackChunkName: "resetpassword" */ "./views/ResetPassword.vue")
        },
        {
            path: "/profile/activate/:id",
            name: "profile-activate",
            component: () => import(/* webpackChunkName: "profile-activate" */ "./views/ProfileActivate.vue")
        },
        {
            path: "/tokenlogin/:securitytoken",
            name: "tokenlogin",
            component: () => import(/* webpackChunkName: "tokenlogin" */ "./views/TokenLogin.vue")
        },
        {
            path: "/password/:token?",
            name: "password",
            component: () => import(/* webpackChunkName: "password" */ "./views/Password.vue"),
            meta: {
                requiresAuthentication: true
            }
        },
        {
            path: "/queues",
            name: "queues",
            component: () => import(/* webpackChunkName: "queues" */ "./views/Queues.vue"),
            meta: {
                permission: Permissions.View.Queues
            }
        },
        {
            path: "/queue",
            name: "queue",
            component: () => import(/* webpackChunkName: "queue" */ "./views/Queue.vue"),
            meta: {
                permission: Permissions.View.Queues
            }
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    store.dispatch("clearSecondaryNavbarItems");

    if (!access.initialized) {
        return;
    }

    if ((to.meta.permission || to.meta.requiresAuthentication) && access.loginStatus !== "logged-in") {
        router.push({ path: "/login" });
    } else if (to.fullPath === "/login" && access.loginStatus === "logged-in") {
        router.push({ path: "/dashboard" });
    } else if ((to.meta.permission && !access.hasPermission(to.meta.permission))) {
        store.dispatch("addAlert", {
            message: i18n.t("permission-required"),
        });

        router.push({ path: "/dashboard" });
    }
    else {
        return next();
    }
});

export default router;