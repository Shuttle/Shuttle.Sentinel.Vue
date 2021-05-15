<template>
  <div>
    <s-title :text="$t('search')" />
    <b-form @submit="search" v-if="show">
      <b-form-group>
        <div class="row responsive">
          <div class="col-3">
            <b-form-input
              v-model="form.keywords"
              placeholder="keywords"
              class="mb-2"
            ></b-form-input>
          </div>
          <div class="col-1">
            <b-form-input
              v-model="form.issn"
              placeholder="issn"
              class="mb-2"
            ></b-form-input>
          </div>
          <div class="col-2">
            <b-form-datepicker
              v-model="form.date"
              class="mb-2"
            ></b-form-datepicker>
          </div>
          <div class="col-5">
            <b-input-group>
              <b-input-group-text slot="prepend">{{
                $t("list-type")
              }}</b-input-group-text>
              <multiselect
                v-model="form.selectedListTypes"
                :options="optionListTypes"
                label="label"
                track-by="value"
                taggable
                multiple
              ></multiselect>
            </b-input-group>
          </div>
          <div class="col text-right">
            <b-button variant="outline-primary" type="submit">{{
              $t("search")
            }}</b-button>
          </div>
        </div>
      </b-form-group>
    </b-form>
    <b-table
      class="mt-5"
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
      <template #cell(issn)="data">
        <span v-html="data.item.issn" class="text-nowrap"></span>
      </template>
    </b-table>
  </div>
</template>

<script>
import formatter from "../formatter";
import { required } from "vuelidate/lib/validators";

export default {
  name: "Search",
  data() {
    return {
      optionListTypes: [
        {
          label: "Journal Blacklist",
          value: "9CF65D0A-B0A0-4077-A011-3B516AA09E8A",
        },
        {
          label: "Citation Database",
          value: "B27F1F30-7D72-4673-B378-E5E81B3D4045",
        },
        {
          label: "Vetted Journal List",
          value: "4719C4F1-4782-4A37-9A68-631EEC5EE845",
        },
        {
          label: "Vetted Publisher List",
          value: "1435A0F5-ABEB-46B6-8CE6-24CDFDFA6890",
        },
        {
          label: "National Accreditation List",
          value: "6EAF7502-4DBD-4D5A-9D93-164F615F669A",
        },
        {
          label: "Association Accreditation List",
          value: "922CEBC6-EAF5-498B-96D1-67FFC57E8196",
        },
        {
          label: "Institutional Accreditation List",
          value: "7BC15D16-00B8-45C7-B77A-BB1B84830484",
        },
      ],
      items: [],
      fields: [],
      show: true,
      working: false,
      form: {
        keywords: "",
        issn: "",
        date: "",
        selectedListTypes: [],
      },
    };
  },
  validations: {
    form: {
      keywords: {
        required,
      },
    },
  },
  methods: {
    search(evt) {
      const self = this;

      evt.preventDefault();

      if (this.$v.$invalid) {
        return;
      }

      this.working = true;

      self.$api
        .post("referenceworks/search", {
          keywords: self.form.keywords,
          issn: self.form.issn,
          date: self.form.date === "" ? undefined : self.form.date,
          listTypeIds: self.form.selectedListTypes.map(function (item) {
            return item.value;
          }),
        })
        .then(function (response) {
          self.items = response.data;

          if (!self.items) {
            self.items = [];
          }

          self.items.forEach(function (item) {
            var issn = "";

            if (item.printIssn) {
              issn += item.printIssn + "(p)<br/>";
            }

            if (item.onlineIssn) {
              issn += item.onlineIssn + "(o)<br/>";
            }

            if (item.linkIssn) {
              issn += item.linkIssn + "(l)<br/>";
            }

            item.issn = issn;
          });
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  beforeMount() {
    this.fields = [
      {
        label: this.$i18n.t("list"),
        key: "listName",
      },
      {
        label: this.$i18n.t("release-date"),
        key: "releaseDate",
        formatter: formatter.date,
      },
      {
        label: this.$i18n.t("alias"),
        key: "alias",
      },
      {
        label: this.$i18n.t("abbreviation"),
        key: "abbreviation",
      },
      {
        label: this.$i18n.t("issn"),
        key: "issn",
      },
      {
        label: this.$i18n.t("inclusion-date"),
        key: "inclusionDate",
        formatter: formatter.date,
      },
      {
        label: this.$i18n.t("notes"),
        key: "notes",
      },
      {
        label: this.$i18n.t("url"),
        key: "url",
      },
      {
        label: this.$i18n.t("publisher"),
        key: "publisher",
      },
    ];
  },
};
</script>
