<template>
  <div>
    <s-title :text="$t('schedule') + ' (' + $t(action) + ')'" />
    <s-column type="sm">
      <b-form @submit="submit" v-if="show">
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
      </b-form>
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
      <b-form-group
        :label="$t('inbox-work-queue-uri')"
        label-for="input-inbox-work-queue-uri"
      >
        <b-form-input
          id="input-inbox-work-queue-uri"
          v-model="form.inboxWorkQueueUri"
          :state="validateState('inboxWorkQueueUri')"
          class="mb-2"
        ></b-form-input>
        <b-form-invalid-feedback>
          {{ $t("validation.required") }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        :label="$t('cron-expression')"
        label-for="input-cron-expression"
      >
        <b-form-input
          id="input-cron-expression"
          v-model="form.cronExpression"
          :state="validateState('cronExpression')"
          class="mb-2"
        ></b-form-input>
        <b-form-invalid-feedback>
          {{ $t("validation.required") }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        :label="$t('next-notification-date')"
        label-for="input-next-notification-date"
      >
        <b-form-datepicker
          id="input-next-notification-date"
          v-model="form.nextNotificationDate"
          :state="validateState('nextNotificationDate')"
          class="mb-2"
        ></b-form-datepicker>
        <b-form-invalid-feedback>
          {{ $t("validation.required") }} | {{ $t("validation.date") }}
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
    </s-column>
  </div>
</template>

<script>
//import { required, date, datetime } from "vuelidate/lib/validators";
import { required } from "vuelidate/lib/validators";
import router from "../router";
import moment from "moment";

export default {
  name: "Schedule",
  data() {
    const now = new Date();

    return {
      action: "new",
      working: false,
      dataStores: [],
      form: {
        dataStoreId: null,
        name: null,
        inboxWorkQueueUri: null,
        cronExpression: null,
        nextNotificationDate: now,
        nextNotificationTime: now,
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
        name: {
          required,
        },
        inboxWorkQueueUri: {
          required,
        },
        cronExpression: {
          required,
        },
        nextNotificationDate: {
          required,
          //date,
        },
        nextNotificationTime: {
          required,
          //datetime,
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
        .post("schedules", {
          id: this.action === "edit" ? this.form.id : null,
          name: this.form.name,
          inboxWorkQueueUri: this.inboxWorkQueueUri.name,
          cronExpression: this.form.cronExpression,
          nextNotification: new moment(
            this.form.nextNotificationDate +
              " " +
              new moment(this.form.nextNotificationTime).format("hh:mm:ss a")
          ),
        })
        .then(() => {
          self.$store.dispatch("requestSent");
          router.push("/schedules");
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  beforeMount() {
    var self = this;
    const id = self.$route.params.id;

    this.working = true;

    self.$api
      .get("datastores")
      .then(function (response) {
        self.dataStores = response.data;

        if (!id) {
          return;
        }

        this.form.id = id;
        this.action = self.$route.params.action ?? "clone";

        return self.$api.get("datastores/" + id);
      })
      .then(function (response) {
        if (!response) {
          return;
        }

        self.form.name = response.data.name;
        self.form.cronExpression = response.data.cronExpression;
        self.form.providerName = response.data.providerName;
      })
      .finally(function () {
        self.working = false;
      });
  },
};
</script>
