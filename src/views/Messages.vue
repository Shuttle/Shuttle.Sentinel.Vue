<template>
    <div>
        <Title>{{ $t("messages-text") }}</Title>
        <div class="flex flex-row gap-4 mb-2 items-center">
            <div class="w-full">
                <Listbox v-model="sourceQueue" :options="sourceQueues" :label="$t('source-queue')" searchable
                    :filter-value="sourceQueueFilterValue" @filter="sourceQueueFilter" layout="inline" />
            </div>
            <div class="flex gap-2 min-w-fit">
                <Button @click="fetch">{{ $t("fetch") }}</Button>
                <Button @click="move">{{ $t("move") }}</Button>
                <Button @click="copy">{{ $t("copy") }}</Button>
            </div>
            <div class="w-full">
                <Listbox v-model="sourceQueue" :options="sourceQueues" :label="$t('destination-queue')" searchable
                    :filter-value="sourceQueueFilterValue" @filter="sourceQueueFilter" layout="inline" />
            </div>
        </div>
        <Table :fields="fields" :items="items" :busy="busy" striped>
            <template #item(selected)="data">
                <Checkbox v-model="data.selected" />
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
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSecureTableFields } from "@/composables/useSecureTableFields";
import { useDateTimeFormatter } from "@/composables/useDateFormatter";
import { useDebounceFn } from '@vueuse/core';
import { useAlertStore } from '@/stores/alert';

const { t } = useI18n({ useScope: 'global' });
const alertStore = useAlertStore();

const busySourceQueue = ref(false);
const sourceQueue = ref();
const sourceQueues = ref([]);
const sourceQueueFilterValue = ref("");

const busy = ref(false);
const specification = reactive({
    categoryMatch: "",
    maximumRows: 100
});

const maximumRows = [
    { text: '100', value: 100 },
    { text: '500', value: 500 },
    { text: '2000', value: 2000 },
    { text: '5000', value: 5000 },
    { text: '10000', value: 10000 },
]

const fetch = () => {
    if (!sourceQueue.value) {
        alertStore.add({
            message: t('exceptions.source-queue-uri'),
            variant: "warning",
            name: "exceptions.source-queue-uri"
        });
    } else {
        alertStore.remove("exceptions.source-queue-uri");
    }
}

const copy = () => {

}

const move = () => {

}

const refreshQueues = (busy, searchValue, queues) => {
    busy.value = true;

    api
        .get("queues/uri/" + encodeURI(searchValue.value))
        .then(function (response) {
            if (!response || !response.data) {
                return;
            }

            queues.value = response.data.map((item) => {
                return {
                    value: item.id,
                    text: item.uri
                };
            });
        })
        .finally(() => {
            busy.value = false;
        });
};
const refeshSourceQueues = useDebounceFn(() => { refreshQueues(busySourceQueue, sourceQueueFilterValue, sourceQueues) }, 500);

const sourceQueueFilter = (searchValue) => {
    sourceQueueFilterValue.value = searchValue;

    refeshSourceQueues();
}

const fields = useSecureTableFields([
    {
        name: "selected",
    },
    {
        name: "view",
    },
    {
        text: t("message-id"),
        name: "messageId",
    },
    {
        text: t("message"),
        name: "message",
    },
]);

const items = ref([]);

const refreshMessages = () => {
    busy.value = true;

    api
        .get("messages")
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
    refreshMessages();
    refreshQueues(busySourceQueue, sourceQueueFilterValue, sourceQueues);
})
</script>
