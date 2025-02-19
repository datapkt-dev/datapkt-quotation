// import { Vue } from 'vue'
import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'

import QuotationPage from './components/QuotationPage.vue'
import Page404 from './components/Page404.vue'

const routes = [
  {
    path: '/:item',
    name: 'contract item',
    component: QuotationPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: Page404
  },
]

const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(),
  // history: createWebHistory(),
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  }
})
export default router
