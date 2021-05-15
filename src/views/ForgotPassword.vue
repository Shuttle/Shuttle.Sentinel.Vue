<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col"></div>
      <div class="col-xl-3 col-lg-4 col-md-5 mx-auto p-0 mt-5 mb-5">
        <s-title :text="$t('forgot-password')" />
        <b-alert show>{{$t('messages.forgot-password')}}</b-alert>
        <b-form @submit="send" v-if="show" class="w-100">
          <b-form-group
            id="input-group-email"
            :label="$t('email-address')"
            label-for="input-email"
          >
            <b-form-input
              id="input-email"
              v-model="form.emailAddress"
              :state="validateState('emailAddress')"
              class="mb-2"
            ></b-form-input>
            <b-form-invalid-feedback>
              {{ $t("validation.required") }} | {{ $t("validation.email") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <div>
            <b-button
              class="float-right"
              variant="primary"
              type="send"
              :disabled="working"
            >
              <font-awesome-icon
                icon="circle-notch"
                class="fa-spin mr-2"
                v-if="working"
              />
              {{ $t("send") }}
            </b-button>
            <b-button
              class="float-right mr-2"
              variant="muted"
              :disabled="working"
              @click="login"
            >
              {{ $t("login") }}
            </b-button>
          </div>
        </b-form>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        emailAddress: "",
      },
      show: true,
      working: false
    };
  },
  validations: {
    working: false,
    form: {
      emailAddress: {
        required,
        email,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    send(evt) {
      const self = this;
      
      evt.preventDefault();

      this.$v.form.$touch();

      if (this.$v.form.$anyError) {
        return;
      }

      this.$api
        .post("profiles/passwordreset", {
          emailAddress: this.form.emailAddress,
        })
        .then(() => {
          self.$store.dispatch("addAlert", {
            message: this.$t("messages.password-reset-sent"),
            type: "info",
          });
          router.replace("/login");
        })
    },
    login() {
      router.replace("/login");
    },
  },
};
</script>