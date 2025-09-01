import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  ,
  // {
  //   path: '/zonghe1',
  //   name: 'Zonghe1',
  //   component: () => import(/* webpackChunkName: "zonghe" */ '../views/Zonghe1.vue')
  // },
  // {
  //   path: '/zonghe2',
  //   name: 'Zonghe2',
  //   component: () => import(/* webpackChunkName: "zonghe" */ '../views/Zonghe2.vue')
  // },
  // {
  //   path: '/zonghe3',
  //   name: 'Zonghe3',
  //   component: () => import(/* webpackChunkName: "zonghe" */ '../views/Zonghe3.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
