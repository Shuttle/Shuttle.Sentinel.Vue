<template>
  <div>
    <s-title :text="$t('lists')" />
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
      <template #cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          <font-awesome-icon
            :icon="row.detailsShowing ? 'angle-up' : 'angle-down'"
          />
        </b-button>
      </template>
      <template #row-details="row">
        <b-card>
          <b-card-text>
            {{ row.item.abstract }}
          </b-card-text>
          <b-table
            v-if="row.item.disciplines.length"
            class="mt-2"
            tbody-tr-class="d-flex"
            thead-tr-class="d-flex"
            :items="row.item.disciplines"
            :fields="disciplineFields"
            small
            responsive
          >
            <template #cell(url)="data">
              <a
                class="infocon"
                :href="data.item.url"
                target="_blank"
                v-if="data.item.url"
              >
                <font-awesome-icon icon="external-link-alt" />
              </a>
            </template>
          </b-table>
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
import formatter from "../formatter";

export default {
  name: "Lists",
  data() {
    return {
      items: [],
      fields: [],
      disciplineFields: [],
      working: false,
    };
  },
  methods: {
    add() {
      this.$router.push({ name: "list" });
    },
    refresh() {
      const self = this;

      this.working = true;

      self.$api
        .get("reviewlists")
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
        key: "show_details",
      },
      {
        label: this.$i18n.t("acronym"),
        key: "acronym",
      },
      {
        label: this.$i18n.t("name"),
        key: "name",
      },
      {
        label: this.$i18n.t("country"),
        key: "regionName",
      },
      {
        label: this.$i18n.t("type"),
        key: "listTypeName",
      },
      {
        label: this.$i18n.t("scope"),
        key: "listScopeName",
      },
    ];

    this.disciplineFields = [
      {
        label: "",
        key: "url",
        class: "col-1",
      },
      {
        label: this.$i18n.t("release-date"),
        key: "effectiveFromDate",
        formatter: formatter.date,
        class: "col",
      },
      {
        label: this.$i18n.t("discipline"),
        key: "discipline",
        class: "col",
      },
    ];

    if (this.$access.hasPermission("Sentinel://lists/manage")) {
      this.$store.dispatch("addSecondaryNavbarItem", {
        icon: "plus-square",
        click() {
          self.add();
        },
      });
    }

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
