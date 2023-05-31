<template>
  <div>
    <h1>Hive List</h1>
    <ul>
      <li v-for="hive in hives" :key="hive._id">
        <router-link :to="{ name: 'hive-detail', params: { id: hive._id } }">{{ hive.name }}, {{ hive.weight }}, {{ hive.date }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HiveList',
  data() {
    return {
      hives: []
    }
  },
  created() {
    this.getHives()
  },
  methods: {
    async getHives() {
      const response = await fetch('/api/hives')
      const data = await response.json()
      this.hives = data
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
</style>
