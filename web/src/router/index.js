import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Unknow from '../components/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/upload',
        name: 'Upload',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/Upload.vue')
      },
      {
        path: '/main',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/Main.vue')
      },
      {
        path: '/artist',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/Artist.vue')
      },
      {
        path: '/news',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/New.vue')
      },
      {
        path: '/detail/:id',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/Detail.vue'),
        props: true
      },
      {
        path: '/new/detail/:id',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/NewDetail.vue'),
        props: true
      },
      {
        path: '/cate/:id',
        component: () =>
          import(/* webpackChunkName: "Login" */ '../views/Cate.vue'),
        props: true
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "Login" */ '../views/Register.vue')
  },
  {
    path: '/404',
    name: '404',
    component: Unknow
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (!to.meta.isPublic && !localStorage.token) {
//     return next('/')
//   }
//   next()
// })

export default router
