<template>
  <div>
    <b-jumbotron
      class="text-center"
      :header="$t('profile-activation')"
      :lead="message"
      bg-variant="light"
      :text-variant="variant"
    >
      <s-working v-if="working" />
      <b-button
        variant="primary"
        to="/login"
        v-if="activated"
      >
        {{ $t("login") }}
      </b-button>
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
      message: this.$t("profile-activating"),
    };
  },
  validations: {},
  computed: {},
  methods: {},
  mounted() {
    this.$api
      .post("profiles/activate/" + this.$route.params.id)
      .then((response) => {
        if (response.data.ok) {
          this.message = this.$t("profile-activated");
          this.variant = "success";
          this.activated = true;
        } else {
          this.message = this.$t(
            "profile-activation-failed",
            response.data.message
          );
          this.variant = "danger";
        }
      })
      .catch((error) => {
        this.message = this.$t("profile-activation-failed", error);
        this.variant = "danger";
      })
      .finally(() => {
        this.working = false;
      });
  },
};
</script>  