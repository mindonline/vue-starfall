<template>
  <div id="app">
    <vue-starfall height="100%" width="100%" user-feedback>
      <img alt="Vue logo" src="./assets/logo.png" class="logo">
    </vue-starfall>
  </div>
</template>

<script>
import VueStarfall from './components/VueStarfall.vue'

export default {
  name: 'app',
  components: {
    VueStarfall
  }
}
</script>

<style>
  html, body, #app {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
