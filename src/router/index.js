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
                permission: Permissions.View.Monitoring
            }
        },
        {
            path: "/logentries",
            name: "logentries",
            component: () => import('../views/LogEntries.vue'),
            meta: {
                permission: Permissions.View.Monitoring
            }
        },
        {
            path: "/message-types/associations",
            name: "message-type-associations",
            component: () => import('../views/MessageTypeAssociations.vue'),
            meta: {
                permission: Permissions.View.Monitoring
            }
        },
        {
            path: "/message-types/dispatched",
            name: "message-type-dispatched",
            component: () => import('../views/MessageTypesDispatched.vue'),
            meta: {
                permission: Permissions.View.Monitoring
            }
        },
        {
            path: "/message-types/handled",
            name: "message-type-handled",
            component: () => import('../views/MessageTypesHandled.vue'),
            meta: {
                permission: Permissions.View.Monitoring
            }
        },
        {
            path: "/messages",
            name: "messages",
            component: () => import('../views/Messages.vue'),
            meta: {
                permission: Permissions.Manage.Messages
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
        {
            path: "/subscriptions",
            name: "subscriptions",
            component: () => import('../views/Subscriptions.vue'),
            meta: {
                permission: Permissions.View.Subscriptions
            }
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
