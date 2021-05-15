<template>
  <div>
    <b-navbar-nav v-if="to">
      <b-nav-item :to="to">{{ $t(text) }}</b-nav-item>
    </b-navbar-nav>
    <b-nav-item-dropdown v-else :text="text">
        <b-dropdown-item v-for="item in items" :key="item.href" :to="item.to">{{item.text}}</b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script>
export default {
    props: {
        to: String,
        text: String,
        items: Array
    }
};
</script>