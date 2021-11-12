<template>
  <div>
    <s-title :text="$t('subscriptions')" />
    <b-form-group :label="$t('data-store')" label-for="input-data-store">
      <b-form-select
        id="input-data-store"
        v-model="dataStoreId"
        :options="dataStores"
        value-field="id"
        text-field="name"
        @change="refresh"
      ></b-form-select>
      <b-form-invalid-feedback>
        {{ $t("validation.required") }}
      </b-form-invalid-feedback>
    </b-form-group>
    <b-table
      class="mt-2"
      :items="items"
      :fields="fields"
      small
      responsive
      hover
      outlined
      striped
      stacked="md"
      :busy="working"
      show-empty
      :empty-text="$t('messages.no-items')"
    >
      <template #table-busy>
        <s-working />
      </template>
      <template v-slot:cell(clone)="data">
        <b-button
          variant="outline-primary"
          @click="clone(data.item)"
          size="sm"
          :disabled="!$access.hasPermission('sentinel://subscriptions/manage')"
          ><font-awesome-icon icon="clone"
        /></b-button>
      </template>
      <template v-slot:cell(edit)="data">
        <b-button
          variant="outline-primary"
          @click="edit(data.item)"
          size="sm"
          :disabled="!$access.hasPermission('sentinel://subscriptions/manage')"
          ><font-awesome-icon icon="edit"
        /></b-button>
      </template>
      <template v-slot:cell(remove)="data">
        <b-button
          variant="outline-danger"
          v-b-modal.modal-confirmation
          size="sm"
          @click="selectItem(data.item)"
          :disabled="!$access.hasPermission('sentinel://subscriptions/manage')"
        >
          <font-awesome-icon icon="trash-alt" />
        </b-button>
      </template>
    </b-table>
    <b-modal
      id="modal-confirmation"
      :title="$t('confirmation-remove.title')"
      button-size="sm"
      :ok-title="$t('ok')"
      :cancel-title="$t('cancel')"
      @ok="remove"
    >
      <template v-slot:modal-header-close>
        <font-awesome-icon icon="times" />
      </template>
      <p>{{ $t("confirmation-remove.message") }}</p>
    </b-modal>
  </div>
</template>

<script>
import Permissions from "../permissions";
import router from "../router";

export default {
  name: "Schedules",
  data() {
    return {
      dataStoreId: null,
      dataStores: [],
      items: [],
      fields: [],
      working: false,
    };
  },
  methods: {
    clone(item) {
      this.$store.dispatch("addElement", {
        key: "subscription",
        data: item,
      });
      router.replace(`/subscription/${this.dataStoreId}/clone`);
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    remove() {
      const self = this;

      this.$api
        .post(`/subscriptions/remove`, {
          dataStoreId: this.form.dataStoreId,
          messageType: this.form.messageType,
          inboxWorkQueueUri: this.form.inboxWorkQueue.uri,
        })
        .then(function () {
          self.$store.dispatch("requestSent");
          self.refresh();
        });
    },
    refresh() {
      const self = this;

      if (!this.dataStoreId) {
        self.working = false;
        return;
      }

      this.working = true;

      self.$api
        .get("subscriptions/" + this.dataStoreId)
        .then(function (response) {
          self.items = response.data;
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  beforeMount() {
    var self = this;

    this.fields = [
      {
        label: "",
        key: "clone",
        thClass: "button",
      },
      {
        label: this.$i18n.t("message-type"),
        key: "messageType",
      },
      {
        label: this.$i18n.t("inbox-work-queue-uri"),
        key: "securedUri",
      },
      {
        label: "",
        key: "remove",
        thClass: "button",
      },
    ];

    this.$store.dispatch("addSecondaryNavbarItem", {
      icon: "sync-alt",
      click() {
        self.refresh();
      },
    });

    this.$store.dispatch("addSecondaryNavbarItem", {
      permission: Permissions.Manage.DataStores,
      icon: "plus-square",
      click() {
        router.replace("/subscription");
      },
    });

    this.working = true;

    self.$api
      .get("datastores")
      .then(function (response) {
        self.dataStores = response.data;
      })
      .finally(function () {
        self.refresh();
      });
  },
};
</script>
