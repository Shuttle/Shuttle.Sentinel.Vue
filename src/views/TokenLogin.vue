<template>
  <div>
    <b-jumbotron
      class="text-center"
      :header="$t('token-login')"
      :lead="message"
      :text-variant="variant"
    >
      <s-working v-if="working" />
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  data() {
    return {
      working: true,
      activated: false,
      variant: "info",
      message: this.$t("token-login-working"),
    };
  },
  validations: {},
  computed: {},
  methods: {},
  mounted() {
    const self = this;

    self.$api
      .post("profiles/tokenLogin/" + self.$route.params.securitytoken)
      .then((response) => {
        if (response.data.success) {
          self.message = self.$t("token-login-successful");
          self.variant = "success";
          self.$access.register(response.data);
          self.$store.commit('AUTHENTICATED');
          self.$router.push({ name: "dashboard" });
        } else {
          self.message = self.$t(
            "token-login-failed",
            response.data.message
          );
          self.variant = "danger";
        }
      })
      .catch((error) => {
        self.message = self.$t("token-login-failed", error);
        self.variant = "danger";
      })
      .finally(() => {
        self.working = false;
      });
  },
};
</script>  