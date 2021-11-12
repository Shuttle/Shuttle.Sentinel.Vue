<template>
  <div>
    <s-title :text="$t('queue') + ' (' + $t(action) + ')'" />
    <s-column type="sm">
      <b-form @submit="submit" v-if="show">
        <b-form-group :label="$t('uri')" label-for="input-uri">
          <b-form-input
            id="input-uri"
            v-model="form.uri"
            :state="validateState('uri')"
            class="mb-2"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :label="$t('processor')" label-for="input-processor">
          <b-form-select
            id="input-processor"
            v-model="form.processor"
            :options="processorOptions"
            value-field="value"
            text-field="text"
            class="mb-2"
            :state="validateState('processor')"
          ></b-form-select>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :label="$t('type')" label-for="input-type">
          <b-form-select
            id="input-type"
            v-model="form.type"
            :options="typeOptions"
            value-field="value"
            text-field="text"
            class="mb-2"
            :state="validateState('type')"
          ></b-form-select>
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
      action: "new",
      working: false,
      processorOptions: [
        {
          value: "unknown",
          text: "unknown",
        },
        {
          value: "inbox",
          text: "inbox",
        },
        {
          value: "outbox",
          text: "outbox",
        },
        {
          value: "control-inbox",
          text: "control-inbox",
        },
      ],
      typeOptions: [
        {
          value: "unknown",
          text: "unknown",
        },
        {
          value: "work",
          text: "work",
        },
        {
          value: "error",
          text: "error",
        },
      ],
      form: {
        uri: null,
        processor: null,
        type: null,
      },
      show: true,
    };
  },
  validations() {
    return {
      form: {
        uri: {
          required,
        },
        processor: {
          required,
        },
        type: {
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
        .post("queues", {
          uri: this.form.uri,
          processor: this.form.processor,
          type: this.form.type,
        })
        .then(() => {
          self.$store.dispatch("requestSent");
          router.push("/queues");
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  beforeMount() {
    const self = this;
    const id = self.$route.params.id;

    if (!id) {
      return;
    }

    self.action = self.$route.params.action ?? "clone";

    this.working = true;

    self.$api
      .get("queues/" + id)
      .then((response) => {
        self.id = response.data.id;
        self.form.uri = response.data.uri;
        self.form.processor = response.data.processor;
        self.form.type = response.data.type;
      })
      .finally(function () {
        self.working = false;
      });
  },
};
</script>
