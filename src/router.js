import Vue from 'vue'
import Router from 'vue-router'
import access from './access';
import store from './store';
import i18n from './i18n';

Vue.use(Router)

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "landing",
            component: () => import(/* webpackChunkName: "landing" */ "./views/Landing.vue")
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue")
        },
        {
            path: "/list",
            name: "list",
            component: () => import(/* webpackChunkName: "list" */ "./views/List.vue"),
            meta: {
                permission: "Sentinel://lists/manage"
            }
        },
        {
            path: "/lists",
            name: "lists",
            component: () => import(/* webpackChunkName: "lists" */ "./views/Lists.vue")
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
            path: "/report",
            name: "report",
            component: () => import(/* webpackChunkName: "report" */ "./views/Report.vue"),
            meta: {
                requiresAuthentication: true
            }
        },
        {
            path: "/search",
            name: "search",
            component: () => import(/* webpackChunkName: "search" */ "./views/Search.vue"),
            meta: {
                requiresAuthentication: true
            }
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
        }
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
        router.push({ path: "/search" });
    } else if ((to.meta.permission && !access.hasPermission(to.meta.permission))) {
        store.dispatch("addAlert", {
            message: i18n.t("permission-required"),
        });

        router.push({ path: "/search" });
    }
    else {
        return next();
    }
});

export default router;