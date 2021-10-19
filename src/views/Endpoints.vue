<template>
  <div>
    <s-title :text="$t('endpoints')" />
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
      <template v-slot:cell(remove)="data">
        <b-button
          variant="outline-danger"
          v-b-modal.modal-confirmation
          size="sm"
          @click="selectRole(data.item)"
          :disabled="!$access.hasPermission('sentinel://monitoring/manage')"
        >
          <font-awesome-icon icon="trash-alt" />
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "Endpoints",
  data() {
    return {
      items: [],
      fields: [],
      working: false,
    };
  },
  methods: {
    heartbeatStatusText(status) {
      this.$i18n.t(`statuses.heatlh.${status}`);
    },
    heartbeatStatusVariant(status) {
      switch (status) {
        case "up": {
          return "success";
        }
        case "down": {
          return "danger";
        }
        default: {
          return "warning";
        }
      }
    },
    refresh() {
      const self = this;

      this.working = true;

      self.$api
        .get("endpoints")
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
        label: this.$i18n.t("status"),
        key: "status",
      },
      {
        label: this.$i18n.t("machine-name"),
        key: "machineName",
      },
      {
        label: this.$i18n.t("base-directory"),
        key: "baseDirectory",
      },
      {
        label: this.$i18n.t("assembly-qualified-name"),
        key: "assemblyQualifiedName",
      },
      {
        label: this.$i18n.t("ipv4-address"),
        key: "ipv4Address",
      },
      {
        label: this.$i18n.t("heartbeat-date"),
        key: "heartbeatDate",
      },
      {
        label: this.$i18n.t("heartbeat-interval"),
        key: "heartbeatInterval",
      },
      {
        label: this.$i18n.t("Remove"),
      },
    ];

    this.$store.dispatch("addSecondaryNavbarItem", {
      icon: "sync-alt",
      click() {
        self.refresh();
      },
    });

    this.refresh();
  },
};
</script>
