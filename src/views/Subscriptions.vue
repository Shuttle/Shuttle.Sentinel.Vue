<template>
    <div>
        <Title>{{ $t("subscriptions") }}</Title>
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
import { useSecureTableFields } from "@/composables/useSecureTableFields";

const { t } = useI18n({ useScope: 'global' });
const busy = ref();

const fields = useSecureTableFields([
    {
        text: t("environment"),
        name: "environmentName",
    },
    {
        text: t("message-type"),
        name: "messageType",
    },
    {
        text: t("inbox-work-queue-uri"),
        name: "inboxWorkQueueUri",
    },
]);

const items = ref([]);

const refresh = () => {
    busy.value = true;

    api
        .get("subscriptions")
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
