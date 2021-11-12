<template>
  <div>
    <s-title :text="$t('queues')" />
    <b-table
      ref="table"
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
          :disabled="!$access.hasPermission('sentinel://queues/manage')"
          ><font-awesome-icon icon="clone"
        /></b-button>
      </template>
      <template v-slot:cell(edit)="data">
        <b-button
          variant="outline-primary"
          @click="edit(data.item)"
          size="sm"
          :disabled="!$access.hasPermission('sentinel://queues/manage')"
          ><font-awesome-icon icon="edit"
        /></b-button>
      </template>
      <template v-slot:cell(toggleSecureUri)="data">
        <b-button
          variant="outline-primary"
          @click="toggleSecuredUri(data.item)"
          size="sm"
          :class="data.item.toggleSecuredUriClass"
        >
          <font-awesome-icon :icon="data.item.toggleSecuredUriIcon" /></b-button
        >
      </template>
      <template v-slot:cell(remove)="data">
        <b-button
          variant="outline-danger"
          v-b-modal.modal-confirmation
          size="sm"
          @click="selectItem(data.item)"
          :disabled="!$access.hasPermission('sentinel://queues/manage')"
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
      selectedItem: Object,
      items: [],
      fields: [],
      working: false,
    };
  },
  methods: {
    toggleSecuredUri(item) {
      item.secured = !item.secured;
      item.toggleSecuredUriIcon = item.secured ? "eye" : "eye-slash";
      item.displayUri = item.secured ? item.securedUri : item.uri;
      this.$refs.table.refresh();
    },
    edit(item) {
      router.replace(`/queue/${item.id}/edit`);
    },
    clone(item) {
      router.replace(`/queue/${item.id}/clone`);
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    remove() {
      const self = this;

      this.$api.delete("queues/" + self.selectedItem.id).then(function () {
        self.$store.dispatch("requestSent");
        self.refresh();
      });
    },
    refresh() {
      const self = this;

      this.working = true;

      self.$api
        .get("queues")
        .then(function (response) {
          self.items = response.data;

          self.items.forEach((item) => {
            item.hasSecuredUri = item.uri !== item.securedUri;
            item.displayUri = item.securedUri;
            item.toggleSecuredUriIcon = "eye";
            item.toggleSecuredUriClass = item.hasSecuredUri ? "" : "d-none";
            item.secured = true;
          });
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
        label: "",
        key: "edit",
        thClass: "button",
      },
      {
        label: "",
        key: "toggleSecureUri",
        thClass: "button",
      },
      {
        label: this.$i18n.t("uri"),
        key: "displayUri",
      },
      {
        label: this.$i18n.t("processor"),
        key: "processor",
      },
      {
        label: this.$i18n.t("type"),
        key: "type",
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
        router.replace("/queue");
      },
    });

    this.refresh();
  },
};
</script>
