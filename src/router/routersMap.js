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
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/home/home.vue')
  },
  {
    title: '平台推荐',
    path: 'recommend',
    icon: 'ios-contacts',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/recommend/list.vue')
  },
  {
    title: '用户推荐',
    path: 'referres',
    icon: 'logo-yen',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/referres/list.vue')
  },
  {
    title: '用户列表',
    path: 'userlist',
    icon: 'ios-contact',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/users/list.vue')
  },
  {
    title: '用户充值',
    path: 'userPay',
    icon: 'logo-usd',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/userPay/list.vue')
  },
  {
    title: '用户订单',
    path: 'orders',
    icon: 'ios-paper',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/orders/list.vue')
  },
  {
    title: '红娘服务',
    path: 'redlove',
    icon: 'md-contacts',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/redlove/list.vue')
  },
  {
    title: '实名认证',
    path: 'authentication',
    icon: 'ios-card',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/authentication/list.vue')
  },
  {
    title: '认证申请',
    path: 'beloved',
    icon: 'md-clipboard',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/beloved/list.vue')
  },
  {
    title: '用户反馈',
    path: 'feedbacks',
    icon: 'md-chatbubbles',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/users/feedbacks.vue')
  },
  {
    title: '投诉列表',
    path: 'complain',
    icon: 'md-bonfire',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/users/complain.vue')
  },
  {
    title: '管理平台',
    path: 'admin',
    icon: 'logo-sass',
    meta: {
      access: ['super_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/admin/Administrator.vue')
  },
  {
    title: '我的客户',
    path: 'client',
    icon: 'ios-people',
    meta: {
      access: [],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/client/list.vue')
  },
  {
    title: '服务跟进',
    path: 'myService',
    icon: 'logo-sass',
    meta: {
      access: [],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/myService/list.vue')
  },
  {
    title: '活动列表',
    path: 'activityList',
    icon: 'ios-wine',
    meta: {
      access: [],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/activity/list.vue')
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
              icon: item.icon,
              title: item.title,
            },
            component: item.component
          }
        ]
      }
    )
  }
  console.log(routerList)
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
      access: ['super_admin'],
      // notCache: "true",
      hideInMenu: true
    },
    component: routerMap['Main'],
    children: [
      {
        path: 'user_detail/:user_detail_id',
        name: 'user_detail',
        meta: {
          title: '用户详情',
          hideInMenu: true,
          // access: ['super_admin']
        },
        component: () => import('@/view/users/user_detail.vue')
      },
      {
        path: 'user_recommend/:user_recommend_id',
        name: 'user_recommend',
        meta: {
          title: '推荐',
          hideInMenu: true,
          access: ['super_admin']
        },
        component: () => import('@/view/users/user_recommend.vue')
      },
      {
        path: 'record/:record_id',
        name: 'record',
        meta: {
          title: '收益记录',
          hideInMenu: true,
          access: ['super_admin']
        },
        component: () => import('@/view/referres/record.vue')
      },

      {
        path: 'user_note/:user_note_id',
        name: 'user_note',
        meta: {
          title: '备注管理',
          hideInMenu: true,
          notCache: true
          // access: ['super_admin']
        },
        component: () => import('@/view/users/user_note.vue')
      },
      {
        path: 'note_detail/:note_detail_id',
        name: 'note_detail',
        meta: {
          title: '备注详情',
          // access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/noteDetail.vue')
      },
      {
        path: 'order/:order_id',
        name: 'order-detail',
        meta: {
          title: '订单详情',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/orders/detail.vue')
      },
      {
        path: 'clients/:clients_id',
        name: 'clients',
        meta: {
          title: '客户列表',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/clientlist.vue')
      },
      {
        path: 'edit_user_detail/:edit_user_detail_id',
        name: 'edit_user_detail',
        meta: {
          title: '编辑用户',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/edituserDetail.vue')
      },
      {
        path: 'user_order/:user_order_id',
        name: 'user_order',
        meta: {
          title: '订单列表',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/user_order.vue')
      },
      {
        path: 'user_gift/:user_gift_id',
        name: 'user_gift',
        meta: {
          title: '礼物列表',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/user_gift.vue')
      },
      {
        path: 'user_integral/:user_integral_id',
        name: 'user_integral',
        meta: {
          title: '福分记录',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/user_integral.vue')
      },
      {
        path: 'activity/:activity_id',
        name: 'activity',
        meta: {
          title: '活动详情',
          hideInMenu: true
        },
        component: () => import('@/view/activity/activity.vue')
      },
      {
        path: 'activity_detail/:activity_detail_id',
        name: 'activity_detail',
        meta: {
          title: '活动现场',
          hideInMenu: true
        },
        component: () => import('@/view/activity/index.vue')
      },
      {
        path: 'member_detail/:member_detail_id',
        name: 'member_detail',
        meta: {
          title: '会员详情',
          hideInMenu: true
        },
        component: () => import('@/view/activity/member_detail.vue')
      },
    ]
  }
]





