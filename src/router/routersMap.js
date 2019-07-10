const Main = () => import('@/view/main')
const Login = () => import('@/view/login/login.vue')
const reset = () => import('@/view/login/reset.vue')
const Home = () => import('@/view/home/home.vue')
const Error401 = () => import('@/view/error-page/401.vue')
const Error500 = () => import('@/view/error-page/500.vue')
const Error404 = () => import('@/view/error-page/404.vue')

export const routerMap = {
  Main,
  Login, Home,
  reset,
  Error401,
  Error500,
  Error404
}
const data = [
  {
    title: '数据统计',
    path: 'statistics',
    icon: 'md-analytics',
    meta: {
      access: ['admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/home/home.vue')
  },
  {
    title: '广告管理',
    path: 'advertising',
    icon: 'md-cog',
    meta: {
      access: ['admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/advertising/list.vue')
  },
  {
    title: '文章管理',
    path: 'article',
    icon: 'ios-ionic-outline',
    meta: {
      access: ['admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/article/list.vue')
  },
  {
    title: '用户管理',
    path: 'userlist',
    icon: 'ios-contact',
    meta: {
      access: ['admin'],
      hideInMenu: false,
      notCache: false
    },
    component: () => import('@/view/users/list.vue')
  },
  {
    title: '兼职管理',
    path: 'jobList',
    icon: 'ios-wine',
    meta: {
      access: ['admin'],
      hideInMenu: false
    },
    component: () => import('@/view/job/list.vue')
  },
  {
    title: '兼职类型',
    path: 'jobType',
    icon: 'md-cog',
    meta: {
      access: ['admin'],
      hideInMenu: false
    },
    component: () => import('@/view/jobType/list.vue')
  },
  {
    title: '后台权限',
    path: 'admin',
    icon: 'ios-paw',
    meta: {
      access: ['admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/admin/list.vue')
  }
]
const setRouter = () => {
  const routerList = []
  for (let item of data) {
    routerList.push(
      {
        path: '/',
        name: '_' + item.path,
        component: routerMap['Main'],
        meta: item.meta,
        children: [
          {
            path: '/' + item.path,
            name: item.path,
            meta: {
              access: item.meta.access,
              icon: item.icon,
              title: item.title,
              notCache: false,
            },
            component: item.component
          }
        ]
      }
    )
  }
  return routerList
}
export const staticRouters = [
  {path: '/login', name: 'login', meta: {title: 'Login - 登录', hideInMenu: true}, component: routerMap['Login']},
  {path: '/reset', name: 'reset', meta: {title: 'Login - 修改密码', hideInMenu: true}, component: routerMap['reset']},
  {path: '/401', name: 'error_401', meta: {hideInMenu: true}, component: routerMap['Error401']},
  {path: '/500', name: 'error_500', meta: {hideInMenu: true}, component: routerMap['Error500']},
  {path: '*', name: 'error_404', meta: {hideInMenu: true}, component: routerMap['Error404']},
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    meta: {notCache: true, hideInMenu: true},
    component: routerMap['Main'],
    children: [{
      path: '/home',
      name: 'home',
      meta: {notCache: true, hideInMenu: true, title: '首页'},
      component: routerMap['Home']
    }]
  },
  ...setRouter(),
  {
    path: '/',
    name: '二级页面',
    meta: {
      icon: 'logo-windows',
      title: 'admin',
      access: ['admin'],
      // notCache: "true",
      hideInMenu: true
    },
    component: routerMap['Main'],
    children: [
      {
        path: 'articleDetail/:id',
        name: 'articleDetail',
        meta: {
          title: '文章详情',
          hideInMenu: true
        },
        component: () => import('@/view/article/detail.vue')
      },
      {
        path: 'jobDetail/:id',
        name: 'jobDetail',
        meta: {
          title: '兼职详情',
          hideInMenu: true
        },
        component: () => import('@/view/job/activity.vue')
      },
      // ---分------
      {
        path: 'user_detail/:id',
        name: 'user_detail',
        meta: {
          title: '用户详情',
          hideInMenu: true,
          notCache: false,
          // access: ['super_admin']
        },
        component: () => import('@/view/users/user_detail.vue')
      }
    ]
  }
]





