<template>
  <div id="app">
    <ApiaryChart/>
  </div>
</template>

<script>
import ApiaryChart from './components/ApiaryChart.vue';

export default {
  name: 'App',
  components: {
    ApiaryChart,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #FAD33D;
  color: #BB3D04;
}
</style>
