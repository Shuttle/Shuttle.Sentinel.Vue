import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "@/stores/session";
import { useAlertStore } from "@/stores/alert";
import Permissions from "@/permissions";

export let messages = {
    insufficientPermission: "You do not have permission to access the requested view.  Please contact your system administrator if you require access.",
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import('../views/Dashboard.vue')
        },
        {
            path: "/endpoints",
            name: "endpoints",
            component: () => import('../views/Endpoints.vue'),
            meta: {
                permission: Permissions.View.Endpoints
            }
        },
        {
            path: "/queues",
            name: "queues",
            component: () => import('../views/Queues.vue'),
            meta: {
                permission: Permissions.View.Queues
            }
        },
        {
            path: '/signin',
            name: 'sign-in',
            component: () => import('../views/SignIn.vue')
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const sessionStore = useSessionStore();

    if (!sessionStore.initialized) {
        return next();
    }

    if (!!to.meta.permission && !sessionStore.hasPermission(to.meta.permission)) {
        useAlertStore().add({
            message: messages.insufficientPermission,
            variant: "info",
            name: "insufficient-permission"
        })

        return false;
    }

    if (!!to.meta.authenticated && !sessionStore.authenticated && to.name !== 'signin') {
        return { name: "signin" }
    }

    return next();
})

export default router;
