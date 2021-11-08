<template>
  <div>
    <s-title :text="$t('schedule') + ' (' + $t(action) + ')'" />
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
          :label="$t('inbox-work-queue')"
          label-for="input-inbox-work-queue"
        >
          <s-queue
            id="input-inbox-work-queue"
            v-model="form.inboxWorkQueue"
            :state="validateState('inboxWorkQueue')"
          />
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
        <b-form-group :label="$t('next-notification')">
          <b-form-checkbox
            v-model="form.hasNextNotification"
            name="hasNextNotification"
          >
            {{ $t("has-next-notification") }}
          </b-form-checkbox>
          <b-input-group>
            <b-form-datepicker
              :disabled="!form.hasNextNotification"
              id="input-next-notification-date"
              v-model="form.nextNotificationDate"
              :state="validateState('nextNotificationDate')"
              class="mb-2"
            ></b-form-datepicker>
            <b-form-timepicker
              :disabled="!form.hasNextNotification"
              id="input-next-notification-time"
              v-model="form.nextNotificationTime"
              :state="validateState('nextNotificationTime')"
              class="mb-2"
            ></b-form-timepicker>
          </b-input-group>
          <b-form-invalid-feedback>
            {{ $t("validation.required") }} | {{ $t("validation.date-time") }}
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
        hasNextNotification: true,
        dataStoreId: null,
        name: null,
        inboxWorkQueue: null,
        cronExpression: null,
        nextNotificationDate: now,
        nextNotificationTime: moment(now).format("hh:mm:ss"),
      },
      show: true,
    };
  },
  computed: {
    nextNotification() {
      return moment(
        moment(this.form.nextNotificationDate).format("YYYY/MM/DD") +
          " " +
          this.form.nextNotificationTime
      );
    },
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
        inboxWorkQueue: {
          required,
        },
        cronExpression: {
          required,
        },
        nextNotificationDate: {
          required,
          date(value) {
            return moment(value).isValid();
          },
        },
        nextNotificationTime: {
          required,
          time(value) {
            return moment(
              moment().format("YYYY/MM/DD") + " " + value
            ).isValid();
          },
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
          dataStoreId: this.form.dataStoreId,
          id: this.action === "edit" ? this.form.id : null,
          name: this.form.name,
          inboxWorkQueueUri: this.form.inboxWorkQueue.uri,
          cronExpression: this.form.cronExpression,
          nextNotification: this.form.hasNextNotification
            ? this.nextNotification
            : null,
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
    const dataStoreId = self.$route.params.dataStoreId;
    const id = self.$route.params.id;

    this.working = true;

    self.$api
      .get("datastores")
      .then(function (response) {
        self.dataStores = response.data;

        if (!id) {
          return;
        }

        self.form.id = id;
        self.action = self.$route.params.action ?? "clone";

        return self.$api.get(`schedules/${dataStoreId}/${id}`);
      })
      .then(function (response) {
        if (!response) {
          return;
        }

        self.form.dataStoreId = response.data.dataStoreId;
        self.form.name = response.data.name;
        self.form.inboxWorkQueue = {
            uri: response.data.inboxWorkQueueUri,
            securedUri: response.data.inboxWorkQueueUri
        };
        self.form.cronExpression = response.data.cronExpression;
        self.form.nextNotification = response.data.nextNotification;
      })
      .finally(function () {
        self.working = false;
      });
  },
};
</script>
