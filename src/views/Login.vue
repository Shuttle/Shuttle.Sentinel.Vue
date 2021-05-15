<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col"></div>
      <div class="col-xl-3 col-lg-4 col-md-5 mx-auto p-0 mt-5 mb-5">
        <div>
          <s-title :text="$t('login')" />
          <b-form @submit="login" v-if="show" class="w-100">
            <b-form-group
              id="input-group-email"
              :label="$t('email-address')"
              label-for="input-email"
            >
              <b-form-input
                id="input-email"
                v-model="form.email"
                :state="validateState('email')"
                class="mb-2"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.required") }} | {{ $t("validation.email") }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              id="input-group-password"
              :label="$t('password')"
              label-for="input-password"
            >
              <b-form-input
                id="input-password"
                v-model="form.password"
                required
                class="mb-2"
                type="password"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.required") }}
              </b-form-invalid-feedback>
            </b-form-group>

            <div class="clearfix">
              <b-button
                class="float-left"
                variant="muted"
                :disabled="working"
                @click="forgotPassword"
              >
                {{ $t("forgot-password") }}
              </b-button>
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
                {{ $t("login") }}
              </b-button>
              <b-button
                class="float-right mr-2"
                variant="muted"
                :disabled="working"
                @click="register"
              >
                {{ $t("register") }}
              </b-button>
            </div>
          </b-form>
        </div>
        <div class="mt-5">
          <img
            src="@/assets/github.logo.svg"
            alt="GitHub logo"
            class="oauth-provider"
            @click="oauth('github')"
          />
        </div>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import configuration from "@/configuration";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      show: true,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  computed: {
    working() {
      return this.$store.state.working;
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    login(evt) {
      const self = this;

      evt.preventDefault();

      this.$v.form.$touch();

      if (this.$v.form.$anyError) {
        return;
      }

      this.$store
        .dispatch("login", {
          email: this.form.email,
          password: this.form.password,
        })
        .then(function () {
          router.push("/dashboard");
        })
        .catch((error) => {
          self.$store.dispatch("addAlert", {
            message: error,
            type: "danger",
            name: "login-failure",
          });
        });
    },
    register() {
      router.replace("/register");
    },
    forgotPassword() {
      router.replace("/forgotpassword");
    },
    oauth(name) {
      window.location.href = configuration.getOAuthUrl(name);
    },
  },
  mounted() {
    var message = this.$route.query.message;

    if (message) {
      this.$store.dispatch("addAlert", {
        message: this.$t("messages." + message, {
          email: this.$route.query.email
        }),
        type: "info"
      });
    }
  },
};
</script>