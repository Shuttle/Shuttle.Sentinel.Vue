<template>
    <div>
        <Title>{{ $t("endpoints") }}</Title>
        <Strip>
            <Button :icon="RefreshIcon" size="sm" @click="refresh"></Button>
        </Strip>
        <Table :fields="fields" :items="items" :busy="busy" striped>
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
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RefreshIcon } from "@heroicons/vue/outline";
import { useAlertStore } from "@/stores/alert";
import { useConfirmationStore } from "@/stores/confirmation";
import { useSecureTableFields } from "@/composables/useSecureTableFields";
import Permissions from "@/permissions";

var confirmationStore = useConfirmationStore();

const { t } = useI18n({ useScope: 'global' });
const busy = ref();

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
        text: t("heartbeat-date"),
        name: "heartbeatDate",
    },
    {
        text: t("heartbeat-interval"),
        name: "heartbeatInterval",
    },
    {
        text: t("date-started"),
        name: "dateStarted",
    },
    {
        text: t("date-stopped"),
        name: "dateStopped",
    },

]);

const items = ref([]);

const refresh = () => {
    busy.value = true;

    api
        .get("endpoints")
        .then(function (response) {
            if (!response || !response.data) {
                return;
            }

            items.value = response.data;
        })
        .finally(function () {
            busy.value = false;
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
    refresh();
})
</script>
