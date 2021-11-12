<template>
  <div>
    <s-title :text="$t('subscription') + ' (' + $t(action) + ')'" />
    <s-column type="sm">
      <b-form autocomplete="off" @submit="submit" v-if="show">
        <b-form-group :label="$t('data-store')" label-for="input-data-store">
          <b-form-select
            id="input-data-store"
            v-model="form.dataStoreId"
            :options="dataStores"
            value-field="id"
            text-field="name"
            :state="validateState('dataStoreId')"
          ></b-form-select>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group :label="$t('message-type')" label-for="input-message-type">
          <b-form-input
            id="input-message-type"
            v-model="form.messageType"
            :state="validateState('messageType')"
            class="mb-2"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :label="$t('inbox-work-queue')"
          label-for="input-inbox-work-queue"
        >
          <s-queue
            id="input-inbox-work-queue"
            v-model="form.inboxWorkQueue"
            :state="validateState('inboxWorkQueue')"
          />
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
  name: "Subscription",
  data() {

    return {
      action: "new",
      working: false,
      dataStores: [],
      form: {
        dataStoreId: null,
        messageType: null,
        inboxWorkQueue: null,
      },
      show: true,
    };
  },
  validations() {
    return {
      form: {
        dataStoreId: {
          required,
        },
        messageType: {
          required,
        },
        inboxWorkQueue: {
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
        .post("subscriptions", {
          dataStoreId: this.form.dataStoreId,
          messageType: this.form.messageType,
          inboxWorkQueueUri: this.form.inboxWorkQueue.uri,
        })
        .then(() => {
          self.$store.dispatch("requestSent");
          router.push("/subscriptions");
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  beforeMount() {
    var self = this;
    const dataStoreId = self.$route.params.dataStoreId;

    this.working = true;

    self.$api
      .get("datastores")
      .then(function (response) {
        self.dataStores = response.data;

        if (!dataStoreId) {
          return;
        }

        self.action = self.$route.params.action ?? "clone";

        return self.$store.dispatch("popElement", "subscription");
      })
      .then(function (response) {
        if (!response) {
          return;
        }

        self.form.dataStoreId = dataStoreId;
        self.form.messageType = response.data.messageType;
        self.form.inboxWorkQueue = {
            uri: response.data.inboxWorkQueueUri,
            securedUri: response.data.inboxWorkQueueUri
        };
      })
      .finally(function () {
        self.working = false;
      });
  },
};
</script>
