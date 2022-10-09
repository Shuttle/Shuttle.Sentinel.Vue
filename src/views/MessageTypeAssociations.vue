<template>
    <div>
        <Title>{{ $t("message-type-associations") }}</Title>
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
import { watch, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RefreshIcon } from "@heroicons/vue/outline";
import { useAlertStore } from "@/stores/alert";
import { useSecureTableFields } from "@/composables/useSecureTableFields";
import Permissions from "@/permissions";

const { t } = useI18n({ useScope: 'global' });
const busy = ref();

const fields = useSecureTableFields([
    {
        text: t("message-type-handled"),
        name: "messageTypeHandled",
    },
    {
        text: t("message-type-dispatched"),
        name: "messageTypeDispatched",
    },
    {
        text: t("endpoint-count"),
        name: "endpointCount",
    },
]);

const items = ref([]);

const refresh = () => {
    busy.value = true;

    api
        .get("messagetypeassociations")
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

onMounted(() => {
    refresh();
})
</script>
