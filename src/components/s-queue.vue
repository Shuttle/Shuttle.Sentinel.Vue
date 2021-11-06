<template>
  <div>
    <b-input-group>
      <b-form-input
        v-model="value"
        v-on:input="search"
        :placeholder="$t('placeholders.queue')"
        class="dropdown-toggle"
        aria-expanded="false"
        data-toggle="dropdown"
      ></b-form-input>
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
      value: null,
      items: [],
    };
  },
  methods: {
    selectQueue(item) {
      this.value = item.securedUri;
      this.$emit("queueSelected", item);
    },
    search() {
      const self = this;

      if (!this.value || !this.value.trim()) {
        self.items = [];
        return;
      }

      self.working = true;

      const params = new URLSearchParams();
      params.append("match", this.value);

      self.$api
        .get("queues/uri", {params: params})
        .then(function (response) {
          self.items = response.data;
          self.$refs.queues.classList.add("show");
        })
        .finally(function () {
          self.working = false;
        });
    },
  },
};
</script>