<template>
  <div id="app">
    <keep-alive :max="10">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
};
</script>

<style></style>
