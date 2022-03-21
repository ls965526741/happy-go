import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/Home.vue'
import Login from '@/views/login/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/views/home/pages/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('@/views/home/pages/Users.vue'),
        meta: { permission: 30 }
      },
      {
        path: '/rights',
        component: () => import('@/views/home/pages/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('@/views/home/pages/Roles/index.vue')
      },
      {
        path: '/categories',
        component: () => import('@/views/home/pages/GoodsCate/index.vue')
      },
      {
        path: '/params',
        component: () => import('@/views/home/pages/GoodsParams/index.vue')
      },
      {
        path: '/goods',
        component: () => import('@/views/home/pages/GoodsList/index.vue')
      },
      {
        path: '/add',
        component: () => import('@/views/home/pages/Add.vue')
      },
      {
        path: '/orders',
        component: () => import('@/views/home/pages/Order.vue')
      },
      {
        path: '/reports',
        component: () => import('@/views/home/pages/Reports.vue')
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, fome, next) => {
  if (to.path === '/login') return next()
  if (!sessionStorage.getItem('token')) {
    return next('/login')
  } else {
    return next()
  }
})
export default router
