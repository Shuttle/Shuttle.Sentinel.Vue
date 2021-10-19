<template>
  <div>
    <b-navbar-nav>
      <b-nav-item :to="to" v-if="to">{{ $t(text) }}</b-nav-item>
      <b-nav-item-dropdown v-else :text="text">
        <b-dropdown-item v-for="item in items" :key="item.href" :to="item.to">{{
          item.text
        }}</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
export default {
  props: {
    to: String,
    text: String,
    items: Array,
  },
};
</script>