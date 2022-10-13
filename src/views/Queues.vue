<template>
    <div>
        <Title>{{ $t("queues") }}</Title>
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
import { DuplicateIcon, EyeIcon, EyeOffIcon, PlusIcon, RefreshIcon } from "@heroicons/vue/outline";
import { useRouter } from "vue-router";
import { useAlertStore } from "@/stores/alert";
import { useConfirmationStore } from "@/stores/confirmation";
import { useSecureTableFields } from "@/composables/useSecureTableFields";
import Permissions from "@/permissions";

var confirmationStore = useConfirmationStore();

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const busy = ref();

const fields = useSecureTableFields([
    {
        text: "",
        name: "remove",
        thClass: "w-1",
        permission: Permissions.Manage.Queues
    },
    {
        text: t("uri"),
        name: "uri",
    },
    {
        text: t("processor"),
        name: "processor",
    },
    {
        text: t("type"),
        name: "type",
    },
]);

const items = ref([]);

const refresh = () => {
    busy.value = true;

    api
        .get("queues")
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
