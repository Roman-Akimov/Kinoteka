<script>
import Head from "@/components/Head.vue";
import Main from "@/components/Main.vue";
import Filter from "@/components/Filter.vue";

export default {
  components: {
    Head,
    Main,
    Filter,
  },
};
</script>

<template>
  <div>
    <div class="head">
      <Head />
    </div>
    <div class="main">
      <Main />
    </div>
    <div class="filter">
      <Filter />
    </div>
  </div>
</template>

<style scoped>
</style>
