<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col"></div>
      <div class="col-xl-3 col-lg-4 col-md-5 mx-auto p-0 mt-5 mb-5">
        <s-title :text="$t('reset-password')" />
        <b-form @submit="submit" v-if="show" class="w-100">
          <b-form-group
            id="input-group-password"
            :label="$t('password')"
            label-for="input-password"
          >
            <b-input-group>
              <b-form-input
                id="input-password"
                v-model="form.password"
                :state="validateState('password')"
                :type="form.passwordType"
              ></b-form-input>
              <b-input-group-append>
                <b-button @click="togglepasswordView">
                  <font-awesome-icon :icon="passwordView(form.passwordType)" />
                </b-button>
              </b-input-group-append>
              <b-form-invalid-feedback>
                {{ $t("validation.required") }}
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>

          <b-form-group
            id="input-group-password-confirm"
            :label="$t('password-confirm')"
            label-for="input-password-confirm"
          >
            <b-input-group>
              <b-form-input
                id="input-password-confirm"
                v-model="form.passwordConfirm"
                :state="validateState('passwordConfirm')"
                :type="form.passwordType"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.required") }}
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>

          <div>
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
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import router from "../router";

export default {
  data() {
    return {
      form: {
        password: "",
        passwordConfirm: "",
        passwordType: "password",
        passwordConfirmType: "password",
      },
      working: false,
      show: true,
      token: "",
    };
  },
  validations: {
    form: {
      password: {
        required,
      },
      passwordConfirm: {
        required,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    togglepasswordView() {
      this.form.passwordType =
        this.form.passwordType === "password" ? "text" : "password";
    },
    passwordView(type) {
      return type === "password" ? "eye" : "eye-slash";
    },
    submit(evt) {
      const self = this;

      evt.preventDefault();

      this.$v.form.$touch();

      if (this.$v.form.$anyError) {
        return;
      }

      if (this.form.password !== this.form.passwordConfirm) {
        self.$store.dispatch("addAlert", {
          message: self.$i18n.t("password-mismatch"),
          name: "password-mismatch",
        });
        return;
      }

      this.$api
        .post("profiles/resetpassword", {
          passwordResetToken: this.$route.params.token,
          password: this.form.password,
        })
        .then(function () {
          router.push("/login");
        });
    },
  },
};
</script>