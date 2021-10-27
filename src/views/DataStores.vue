<template>
  <div>
    <s-title :text="$t('data-stores')" />
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
      <template #cell(status)="row">
        <b-badge :variant="heartbeatStatusVariant(row.heartbeatStatus)">{{
          heartbeatStatusText(row.heartbeatStatus)
        }}</b-badge>
      </template>
      <template v-slot:cell(clone)="data">
        <b-button
          variant="outline-primary"
          @click="clone(data.item)"
          size="sm"
          :disabled="!$access.hasPermission('sentinel://data-stores/manage')"
          ><font-awesome-icon icon="clone"
        /></b-button>
      </template>
      <template v-slot:cell(remove)="data">
        <b-button
          variant="outline-danger"
          v-b-modal.modal-confirmation
          size="sm"
          @click="selectItem(data.item)"
          :disabled="!$access.hasPermission('sentinel://data-stores/manage')"
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
  name: "DataStores",
  data() {
    return {
      items: [],
      fields: [],
      working: false,
    };
  },
  methods: {
    clone(item) {
      router.replace("/datastore/" + item.id);
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    remove() {
      const self = this;

      this.$api.delete("datastores/" + self.selectedItem.id).then(function () {
        self.$store.dispatch("requestSent");
        self.refresh();
      });
    },
    refresh() {
      const self = this;

      this.working = true;

      self.$api
        .get("datastores")
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
        label: this.$i18n.t("clone"),
        key: "clone",
      },
      {
        label: this.$i18n.t("name"),
        key: "name",
      },
      {
        label: this.$i18n.t("connection-string"),
        key: "connectionString",
      },
      {
        label: this.$i18n.t("provider-name"),
        key: "providerName",
      },
      {
        label: this.$i18n.t("remove"),
        key: "remove",
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
        router.replace("/datastore");
      },
    });

    this.refresh();
  },
};
</script>
