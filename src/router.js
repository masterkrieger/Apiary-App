import { createRouter, createWebHistory } from 'vue-router'
import HiveList from './components/HiveList.vue'
import HiveDetail from './components/HiveDetail.vue'

const routes = [
  {
    path: '/',
    name: 'hive-list',
    component: HiveList
  },
  {
    path: '/hives/:id',
    name: 'hive-detail',
    component: HiveDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router