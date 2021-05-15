<template>
  <div>
    <b-navbar toggleable="lg" fixed="top">
      <b-navbar-brand href="#">
        <img src="@/assets/logo.png" alt="Sentinel logo" />
      </b-navbar-brand>
      <b-navbar-toggle
        target="nav-text-collapse"
        v-if="authenticated"
      ></b-navbar-toggle>
      <b-collapse id="nav-text-collapse" is-nav v-if="authenticated">
        <s-dropdown
          v-for="item in resources"
          :key="item.text"
          :text="item.text"
          :to="item.to"
          :items="item.items"
        />
      </b-collapse>
      <b-navbar-nav class="ml-auto" right>
        <b-nav-item v-on:click="toggleTheme">
          <font-awesome-icon :icon="themeIcon" />
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar
      type="dark"
      class="navbar-secondary"
      v-if="hasSecondaryNavbarItems"
    >
      <b-nav-form>
        <b-button
          v-for="item in secondaryNavbarItems"
          :key="item.key"
          :variant="!!item.variant ? item.variant : 'outline-secondary'"
          class="mr-2"
          @click="item.click"
          ><font-awesome-icon v-if="!!item.icon" :icon="item.icon"
        /></b-button>
      </b-nav-form>
    </b-navbar>
  </div>
</template>

<script>
import access from "../access";
import router from "../router";
import Dropdown from "./s-dropdown.vue";
import map from "./navigation-map";

export default {
  data() {
    return {
      resources: []
    }
  },
  components: {
    "s-dropdown": Dropdown,
  },
  computed: {
    authenticated() {
      return this.$store.getters.authenticated;
    },
    hasSecondaryNavbarItems() {
      return this.secondaryNavbarItems.length > 0;
    },
    secondaryNavbarItems() {
      return this.$store.getters.secondaryNavbarItems;
    },
    themeIcon() {
      return this.$store.getters.theme === "default" ? "moon" : "sun";
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(function () {
        router.push("/login");
      });
    },
    toggleTheme() {
      this.$store.dispatch("toggleTheme");
    },
  },
  mounted() {
      const result = [];

      map.forEach((item) => {
        var add = false;
        var list = [];

        if (!item.permission || access.hasPermission(item.permission)) {
          if (item.items !== undefined) {
            item.items.forEach((subitem) => {
              if (
                !subitem.permission ||
                access.hasPermission(subitem.permission)
              ) {
                add = true;

                list.push({
                  to: subitem.to,
                  text: subitem.text,
                });
              }
            });
          } else {
            add = true;
          }

          if (add) {
            result.push({
              text: item.text,
              to: item.to || "",
              items: list,
            });
          }
        }
      });

      return result;
  }
};
</script>
