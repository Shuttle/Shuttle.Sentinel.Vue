<template>
  <div>
    <b-input-group>
      <b-form-input
        v-model="searchText"
        v-on:input="search"
        :placeholder="$t('placeholders.queue')"
        class="dropdown-toggle"
        aria-expanded="false"
        data-toggle="dropdown"
        :state="state"
      ></b-form-input>
      <b-form-invalid-feedback>
        {{ $t("validation.required") }}
      </b-form-invalid-feedback>
      <div class="dropdown-menu" ref="queues">
        <a class="dropdown-item" href="#" v-if="items.length === 0">{{
          $t("messages.empty")
        }}</a>
        <a
          class="dropdown-item"
          href="#"
          v-else
          v-for="item in items"
          v-bind:key="item.id"
          v-on:click="selectQueue(item)"
          >{{ item.securedUri }}</a
        >
      </div>
    </b-input-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      working: false,
      searchText: "",
      items: [],
    };
  },
  props: {
    state: Boolean,
    value: Object,
  },
  methods: {
    selectQueue(item) {
      this.$emit("input", item);
    },
    search() {
      const self = this;

      this.$emit("input", null);

      if (!this.searchText || !this.searchText.trim()) {
        self.items = [];
        return;
      }

      self.working = true;

      const params = new URLSearchParams();
      params.append("match", this.searchText);

      self.$api
        .get("queues/uri", { params: params })
        .then(function (response) {
          self.items = response.data;
          self.$refs.queues.classList.add("show");
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
  watch: {
    value(current) {
      this.searchText = current.securedUri;
    },
  },
};
</script>