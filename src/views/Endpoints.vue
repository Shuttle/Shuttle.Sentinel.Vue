<template>
    <div>
        <Title>{{ $t("endpoints") }}</Title>
        <Strip>
            <Button :icon="RefreshIcon" size="sm" @click="refresh"></Button>
            <Listbox v-model="refreshInterval" :options="refreshIntervals" class="w-20" />
        </Strip>
        <Table :fields="fields" :items="items" striped>
            <template #item(status)="data">
                <component v-if="isRunning(data.item)" :is="heartbeatStatusIcon(data.item.heartbeatStatus)"
                    :class="heartbeatStatusIconClasses(data.item.heartbeatStatus)" />
                <span v-else class="border-md rounded-md p-1 m-0.5 text-[.75rem] bg-red-800 text-gray-300">{{
                $t("stopped").toUpperCase() }}</span>
            </template>
            <template #busy>
                <Busy />
            </template>
            <template #empty>
                <TableEmpty />
            </template>
        </Table>
    </div>
</template>

<script setup>
import api from "@/api";
import { watch, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RefreshIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/vue/outline";
import { useAlertStore } from "@/stores/alert";
import { useConfirmationStore } from "@/stores/confirmation";
import { useSecureTableFields } from "@/composables/useSecureTableFields";
import { useDateTimeFormatter } from "@/composables/useDateFormatter";
import Permissions from "@/permissions";

const refreshIntervals = [
    { text: 'none', value: 0 },
    { text: '5s', value: 5 },
    { text: '10s', value: 10 },
    { text: '15s', value: 15 },
    { text: '30s', value: 30 },
]

var confirmationStore = useConfirmationStore();

const { t } = useI18n({ useScope: 'global' });
const busy = ref();
const refreshInterval = ref(0);
let timeout = undefined;

const poll = () => {
    if (timeout) {
        clearTimeout(timeout);
    }

    if (refreshInterval.value === 0)
    {
        return;
    }

    timeout = setTimeout(() => {
        refresh();
    }, refreshInterval.value * 1000);
}

watch(refreshInterval, (value) => {
    poll();
})

const isRunning = (item) => {
    return !item.dateStopped || item.dateStarted > item.dateStopped;
}

const heartbeatStatusIcon = (status) => {
    switch (status) {
        case "up": {
            return CheckCircleIcon;
        }
        case "down": {
            return XCircleIcon;
        }
        default: {
            return ExclamationCircleIcon;
        }
    }
}

const heartbeatStatusIconClasses = (status) => {
    const classes = "align-middle w-6 h-6";

    switch (status) {
        case "up": {
            return `${classes} text-green-500`;
        }
        case "down": {
            return `${classes} text-red-500`;
        }
        default: {
            return `${classes} text-orange-500`;
        }
    }
}

const fields = useSecureTableFields([
    {
        text: "",
        name: "remove",
        thClass: "w-1",
        permission: Permissions.Manage.Monitoring
    },
    {
        text: t("status"),
        name: "status",
    },
    {
        text: t("assembly-qualified-name"),
        name: "entryAssemblyQualifiedName",
    },
    {
        text: t("environment"),
        name: "environmentName",
    },
    {
        text: t("machine-name"),
        name: "machineName",
    },
    {
        text: t("base-directory"),
        name: "baseDirectory",
    },
    {
        text: t("ipv4-address"),
        name: "ipv4Address",
    },
    {
        text: t("transient-instance"),
        name: "transientInstance"
    },
    {
        text: t("heartbeat-timestamp"),
        name: "heartbeatTimestamp",
        formatter: useDateTimeFormatter,
    },
    {
        text: t("date-started"),
        name: "dateStarted",
        formatter: useDateTimeFormatter,
    },
    {
        text: t("date-stopped"),
        name: "dateStopped",
        formatter: useDateTimeFormatter,
    },
]);

const items = ref([]);

const refresh = () => {
    api
        .get("endpoints")
        .then(function (response) {
            if (!response || !response.data) {
                return;
            }

            items.value = response.data;
        })
        .finally(function () {
            poll();
        });
}

const remove = (item) => {
    confirmationStore.setIsOpen(false);

    api
        .delete(`endpoints/${item.id}`)
        .then(function () {
            useAlertStore().requestSent();

            refresh();
        });
}

onMounted(() => {
    busy.value = true;

    refresh();
})
</script>
