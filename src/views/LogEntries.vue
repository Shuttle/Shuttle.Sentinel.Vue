<template>
    <div>
        <Title>{{ $t("log-entries") }}</Title>
        <Strip>
            <Input v-model="specification.categoryMatch" :placeholder="$t('category')"></Input>
            <Listbox v-model="specification.maximumRows" :options="maximumRows" class="w-20" />
            <Button :icon="SearchIcon" size="sm" @click="refresh"></Button>
        </Strip>
        <Table :fields="fields" :items="items" :busy="busy" striped>
            <template #item(endpoint)="data">
                <h1>description</h1>
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
import { SearchIcon } from "@heroicons/vue/outline";
import { useSecureTableFields } from "@/composables/useSecureTableFields";

const { t } = useI18n({ useScope: 'global' });
const busy = ref();
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

const fields = useSecureTableFields([
    {
        text: t("environment"),
        name: "environmentName",
    },
    {
        text: t("endpoint"),
    },
    {
        text: t("log-level"),
        name: "logLevel",
    },
    {
        text: t("category"),
        name: "category",
    },
    {
        text: t("event-id"),
        name: "eventId",
    },
    {
        text: t("message"),
        name: "message",
    },
    {
        text: t("scope"),
        name: "scope",
    },
]);

const items = ref([]);

const refresh = () => {
    busy.value = true;

    api
        .post("logentries/search", specification)
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
