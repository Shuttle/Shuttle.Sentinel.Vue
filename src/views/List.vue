<template>
  <div>
    <s-title :text="$t('list')" />
    <b-form @submit="submit" v-if="show" class="w-100">
      <div class="row">
        <div class="col">
          <b-form-group
            id="input-group-acronym"
            :label="$t('acronym')"
            label-for="input-acronym"
          >
            <b-form-input
              id="input-acronym"
              v-model="form.acronym"
              :state="validateState('acronym')"
              class="mb-2"
            ></b-form-input>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-name"
            :label="$t('name')"
            label-for="input-name"
          >
            <b-form-input
              id="input-name"
              v-model="form.name"
              :state="validateState('name')"
              class="mb-2"
            ></b-form-input>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-abstract"
            :label="$t('abstract')"
            label-for="input-abstract"
          >
            <b-form-textarea
              id="input-abstract"
              v-model="form.abstract"
              :state="validateState('abstract')"
              class="mb-2"
            ></b-form-textarea>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-publisher"
            :label="$t('publisher')"
            label-for="input-publisher"
          >
            <b-form-select
              id="input-publisher"
              v-model="form.publisherId"
              :options="publishers"
              value-field="id"
              text-field="name"
              disabled-field="notEnabled"
              :state="validateState('publisherId')"
            ></b-form-select>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            id="input-group-country"
            :label="$t('country')"
            label-for="input-country"
          >
            <b-form-select
              id="input-country"
              v-model="form.country"
              :options="countries"
              value-field="value"
              text-field="text"
              disabled-field="notEnabled"
              :state="validateState('country')"
            ></b-form-select>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-type"
            :label="$t('type')"
            label-for="input-type"
          >
            <b-form-select
              id="input-type"
              v-model="form.typeId"
              :options="types"
              value-field="id"
              text-field="name"
              disabled-field="notEnabled"
              :state="validateState('typeId')"
            ></b-form-select>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-scope"
            :label="$t('scope')"
            label-for="input-scope"
          >
            <b-form-select
              id="input-scope"
              v-model="form.scopeId"
              :options="scopes"
              value-field="id"
              text-field="name"
              disabled-field="notEnabled"
              :state="validateState('scopeId')"
            ></b-form-select>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-frequency"
            :label="$t('frequency')"
            label-for="input-frequency"
          >
            <b-form-select
              id="input-frequency"
              v-model="form.frequencyId"
              :options="frequencies"
              value-field="id"
              text-field="name"
              disabled-field="notEnabled"
              :state="validateState('frequencyId')"
            ></b-form-select>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }}
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
      </div>
      <div>
        <b-button
          class="float-right"
          variant="primary"
          type="submit"
          :disabled="working"
          @click="submit"
        >
          <font-awesome-icon
            icon="circle-notch"
            class="fa-spin mr-2"
            v-if="working"
          />
          {{ $t("submit") }}
        </b-button>
        <b-button
          class="float-right mr-2"
          variant="light"
          :disabled="working"
          @click="cancel"
        >
          {{ $t("cancel") }}
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: "List",
  data() {
    return {
      show: true,
      working: false,
      publishers: [],
      countries: [],
      types: [],
      scopes: [],
      frequencies: [],
      form: {
        acronym: "",
        name: "",
        abstract: "",
        publisherId: "",
        country: "",
        typeId: "",
        scopeId: "",
        frequencyId: "",
      },
    };
  },
  validations: {
    form: {
      acronym: {
        required,
      },
      name: {
        required,
      },
      abstract: {
        required,
      },
      country: {
        required,
      },
      typeId: {
        required,
      },
      scopeId: {
        required,
      },
      frequencyId: {
        required,
      },
      publisherId: {
        required,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    submit(evt) {
      const self = this;

      evt.preventDefault();

      this.$v.form.$touch();

      if (this.$v.form.$anyError) {
        return;
      }

      this.working = true;

      this.$api
        .post("reviewlists", {
          acronym: this.form.acronym,
          name: this.form.name,
          abstract: this.form.abstract,
          publisherId: this.form.publisherId,
          twoLetterIsoRegionName: this.form.country,
          listFrequencyId: this.form.frequencyId,
          listTypeId: this.form.typeId,
          listScopeId: this.form.scopeId
        })
        .then(function () {
          self.$store.dispatch("addAlert", {
            message: self.$i18n.t("messages.request-sent"),
          });
          self.$router.push({ name: "lists" });
        })
        .finally(function () {
          self.working = false;
        });
    },
    cancel() {
      this.$router.push({ name: "lists" });
    },
  },
  mounted() {
    const self = this;

    this.working = true;

    this.$api
      .get("listpublishers")
      .then(function (response) {
        self.publishers = response.data;
        return self.$api.get("countries").then(function (response) {
          self.countries = response.data;
          return self.$api
            .get("referenceitems/ListType")
            .then(function (response) {
              self.types = response.data;
              return self.$api
                .get("referenceitems/ListScope")
                .then(function (response) {
                  self.scopes = response.data;
                  return self.$api
                    .get("referenceitems/ListFrequency")
                    .then(function (response) {
                      self.frequencies = response.data;
                    });
                });
            });
        });
      })
      .finally(function () {
        self.working = false;
      });
  },
};
</script>
