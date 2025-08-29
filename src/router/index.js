import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PokemonDetail from '../views/PokemonDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/pokemon/:id', name: 'Detail', component: PokemonDetail, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
