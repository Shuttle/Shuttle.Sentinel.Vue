<template>
    <div>
        <Strip>
            <Listbox v-model="refreshInterval" :options="refreshIntervals" class="w-20" />
            <Listbox v-model="displayDuration" :options="displayDurations" class="w-56" />
            <Button :icon="RefreshIcon" size="sm" @click="refresh"></Button>
        </Strip>
        <Table :fields="fields" :items="messageTypeMetrics" striped>
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

const messageTypeMetrics = ref([]);
const refreshInterval = ref(5);
const displayDuration = ref(15);
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

const refreshIntervals = [
    { text: 'none', value: 0 },
    { text: '5s', value: 5 },
    { text: '10s', value: 10 },
    { text: '15s', value: 15 },
    { text: '30s', value: 30 },
]

const displayDurations = [
    { text: t("display-last-5-minutes"), value: 5 },
    { text: t("display-last-15-minutes"), value: 15 },
    { text: t("display-last-30-minutes"), value: 30 },
    { text: t("display-last-60-minutes"), value: 60 },
    { text: t("display-last-24-hours"), value: 1440 }
]

const fields = useSecureTableFields([
    {
        text: t("message-type"),
        name: "messageType",
        sortable: true,
    },
    {
        text: t("environment"),
        name: "environmentName",
    },
    {
        text: t("count"),
        name: "count",
        reverse: true,
        sortable: true,
        tdClass: "text-right",
    },
    {
        text: t("total-execution-duration"),
        name: "totalExecutionDuration",
        reverse: true,
        sortable: true,
        tdClass: "text-right",
    },
    {
        text: t("fastest-execution-duration"),
        name: "fastestExecutionDuration",
        reverse: true,
        sortable: true,
        tdClass: "text-right",
    },
    {
        text: t("slowest-execution-duration"),
        name: "slowestExecutionDuration",
        reverse: true,
        sortable: true,
        tdClass: "text-right",
    },
    {
        text: t("average-execution-duration"),
        name: "averageExecutionDuration",
        reverse: true,
        sortable: true,
        tdClass: "text-right",
    },
]);

const refresh = () => {
    api.post("dashboard/statistics", {
        startDate: new Date(Date.now() - displayDuration.value * 60000)
    })
        .then(response => {
            messageTypeMetrics.value = response.data.messageTypeMetrics;
        })
        .finally(function () {
            poll();
        });
}

onMounted(() => {
    refresh();
})
</script>