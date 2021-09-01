import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/login',
    meta: { isPublic: true },
    component: () => import('../views/Login')
  },
  {
    path: '/main',
    component: Main,
    children: [
      {
        path: '/categories/create',
        component: () => import('../views/CategoryEdit.vue')
      },
      {
        path: '/categories/edit/:id',
        component: () => import('../views/CategoryEdit.vue'),
        props: true // 允许参数注入
      },
      {
        path: '/categories/list',
        component: () => import('../views/CategoryList.vue')
      },
      {
        path: '/images/create',
        component: () => import('../views/ImageEdit.vue')
      },
      {
        path: '/images/edit/:id',
        component: () => import('../views/ImageEdit.vue'),
        props: true // 允许参数注入
      },
      {
        path: '/images/list',
        component: () => import('../views/ImageList.vue')
      },
      {
        path: '/artists/create',
        component: () => import('../views/ArtistEdit.vue')
      },
      {
        path: '/artists/edit/:id',
        component: () => import('../views/ArtistEdit.vue'),
        props: true
      },
      {
        path: '/artists/list',
        component: () => import('../views/ArtistList.vue')
      },
      {
        path: '/articles/create',
        component: () => import('../views/ArticleEdit.vue')
      },
      {
        path: '/articles/edit/:id',
        component: () => import('../views/ArticleEdit.vue'),
        props: true
      },
      {
        path: '/articles/list',
        component: () => import('../views/ArticleList.vue')
      },
      {
        path: '/themes/create',
        component: () => import('../views/ThemeEdit.vue')
      },
      {
        path: '/themes/edit/:id',
        component: () => import('../views/ThemeEdit.vue'),
        props: true
      },
      {
        path: '/themes/list',
        component: () => import('../views/ThemeList.vue')
      },
      {
        path: '/users/create',
        component: () => import('../views/UserEdit.vue')
      },
      {
        path: '/users/edit/:id',
        component: () => import('../views/UserEdit.vue'),
        props: true
      },
      {
        path: '/users/list',
        component: () => import('../views/UserList.vue')
      },
      {
        path: '/banner/create',
        component: () => import('../views/banner.vue')
      }
    ]
  },
  // 404
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  routes
})
// 定义全局导航守卫，进行客户端登录校验 给login路由添加一个meta属性

router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !localStorage.token) {
    return next('/')
  }
  next()
})

export default router
