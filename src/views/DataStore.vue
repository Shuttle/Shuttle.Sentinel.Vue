<template>
  <div>
    <s-title :text="$t('data-store')" />
    <s-column type="sm">
      <b-form @submit="submit" v-if="show">
        <b-form-group :label="$t('name')" label-for="input-name">
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
        <b-form-group :label="$t('connection-string')" label-for="input-connection-string">
          <b-form-input
            id="input-connection-string"
            v-model="form.connectionString"
            :state="validateState('connectionString')"
            class="mb-2"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :label="$t('provider-name')" label-for="input-provider-name">
          <b-form-input
            id="input-provider-name"
            v-model="form.providerName"
            :state="validateState('providerName')"
            class="mb-2"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }}
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="mt-2">
          <b-button
            class="float-right"
            variant="primary"
            type="submit"
            :disabled="working"
          >
            <font-awesome-icon
              icon="circle-notch"
              class="fa-spin mr-2"
              v-if="working"
            />
            {{ $t("submit") }}
          </b-button>
        </div>
      </b-form>
    </s-column>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import router from "../router";

export default {
  name: "ListImport",
  data() {
    return {
      working: false,
      form: {
        name: null,
        connectionString: null,
        providerName: null,
      },
      show: true,
    };
  },
  validations() {
    return {
      form: {
        name: {
          required,
        },
        connectionString: {
          required,
        },
        providerName: {
          required,
        },
      },
    };
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

      self.$api
        .post("datastores", {
          name: this.form.name,
          connectionString: this.form.connectionString,
          providerName: this.form.providerName,
        })
        .then(() => {
          router.push("/datastores");
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  beforeMount() {
    var self = this;

    if (!self.$route.params.id) {
        return;
    }

    this.working = true;

    self.$api
      .get("datastores/" + self.$route.params.id)
      .then(function (response) {
        self.form.name = response.data.name;
        self.form.connectionString = response.data.connectionString;
        self.form.providerName = response.data.providerName;
      })
      .finally(function () {
        self.working = false;
      });
  },
};
</script>
