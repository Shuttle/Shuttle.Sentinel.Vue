<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col"></div>
      <div class="col-xl-3 col-lg-4 col-md-5 mx-auto p-0 mt-5 mb-5">
        <div>
          <s-title :text="$t('register')" />
          <b-form @submit="register" v-if="show" class="w-100">
            <b-form-group
              id="input-group-email-address"
              :label="$t('email-address')"
              label-for="input-email-address"
            >
              <b-form-input
                id="input-email-address"
                v-model="form.emailAddress"
                required
                class="mb-2"
              ></b-form-input>
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
            </b-form-group>

            <div class="clearfix">
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
                {{ $t("register") }}
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
import router from "@/router";
import access from "@/access";
import store from "@/store";
import configuration from "@/configuration";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      form: {
        emailAddress: "",
        password: "",
      },
      show: true,
    };
  },
  validations: {
    form: {
      emailAddress: {
        required,
        email
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
    register(evt) {
      evt.preventDefault();

      this.$v.form.$touch();
      
      if (this.$v.form.$anyError) {
        return;
      }

      this.$api
        .post("profiles", {
          emailAddress: this.form.emailAddress,
          password: this.form.password,
        })
        .then(() => {
          router.push("dashboard");
        })
        .catch((error) => {
          store.dispatch("addAlert", {
            message: this.$t("exceptions.register", error),
            type: "info",
          });
        });
    },
    login() {
      router.replace("/login");
    },
    oauth(name) {
      window.location.href = configuration.getOAuthUrl(name, true);
    },
  },
  mounted() {
    if (access.isUserRequired) {
      store.dispatch("addAlert", {
        message: this.$t("user-required"),

        type: "info",
      });
    }

    var message = this.$route.query.message;

    if (message) {
      this.$store.dispatch("addAlert", {
        message: this.$t("messages." + message, {
          email: this.$route.query.email
        }),
        type: "info"
      });
    }
  }
};
</script>