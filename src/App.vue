<template>
  <div id="app">
    <s-navigation />
    <div style="top: 5em; position: absolute"></div>
    <s-alerts :alerts="alerts" v-on:removed="removeAlert" class="m-2" />
    <s-working v-if="starting" />
    <div class="container-fluid">
      <div class="row row-offcanvas row-offcanvas-left">
        <div id="application-content" class="main col-sm-12 col-md-12">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <footer class="footer p-2">
      <div class="container-fluid text-center">
        <div v-if="debugging">
          <div class="d-none d-xl-block font-weight-bold">X-LARGE (XL)</div>
          <div class="d-none d-lg-block d-xl-none font-weight-bold">
            LARGE (LG)
          </div>
          <div class="d-none d-md-block d-lg-none font-weight-bold">
            MEDIUM (M)
          </div>
          <div class="d-none d-sm-block d-md-none font-weight-bold">
            SMALL (SM)
          </div>
          <div class="d-block d-sm-none alert font-weight-bold">
            X-SMALL (Default)
          </div>
        </div>
        <p class="m-0">Copyright (c) 2020 Sentinel</p>
      </div>
    </footer>
  </div>
</template>

<script>
import configuration from "@/configuration";
import Navigation from "./components/s-navigation.vue";

export default {
  name: "app",
  data() {
    return {
      darkMode: false,
    };
  },
  components: {
    "s-navigation": Navigation,
  },
  computed: {
    debugging() {
      return configuration.debugging();
    },
    alerts() {
      return this.$store.state.alerts.messages;
    },
    starting() {
      return this.$store.state.starting;
    },
  },
  methods: {
    removeAlert(alert) {
      this.$store.commit("REMOVE_ALERT", alert);
    },
  },
  mounted() {
    document.body.classList.add("app-background");

    let theme = localStorage.getItem("theme") || "dark";

    this.$store.commit("APPLY_THEME", {
      theme,
    });
  },
  watch: {
    "$store.state.theme": function () {
      localStorage.setItem("theme", this.$store.state.theme);
      document.documentElement.setAttribute("theme", this.$store.state.theme);
    },
    "$store.state.secondaryNavbarItems": function () {
      if (this.$store.getters.hasSecondaryNavbarItems) {
        document.body.classList.add("navbar-secondary");
      } else {
        document.body.classList.remove("navbar-secondary");
      }
    },
  },
};
</script>
