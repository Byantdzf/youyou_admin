const Main = () => import('@/view/main')
const ParentView = () => import('@/components/parent-view')
const Login = () => import('@/view/login/login.vue')
const Home = () => import('@/view/home/home.vue')
const Error401 = () => import('@/view/error-page/401.vue')
const Error500 = () => import('@/view/error-page/500.vue')
const Error404 = () => import('@/view/error-page/404.vue')
const Markdown = () => import('@/view/components/markdown/markdown.vue')
const Editor = () => import('@/view/components/editor/editor.vue')
const homeSet = () => import('@/view/home/homeSet.vue')
const recommend = () => import('@/view/recommend/list.vue')
const userlist = () => import('@/view/users/list.vue')


export const routerMap = {
  Main,
  ParentView,
  Login, Home,
  Error401,
  Error500,
  Error404,
  // Markdown,
  // Editor,
  homeSet,
  recommend,
  userlist
}
// meta: {
//   hideInMenu: (default: false) 设为true后在左侧菜单不会显示该页面选项
//   showAlways: (default: false) 设为true后如果该路由只有一个子路由，在菜单中也会显示该父级菜单
//   notCache: (default: false) 设为true后页面不会缓存
//   access: (default: null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
//   icon: (default: -) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
//   href: 'https://xxx' (default: null) 用于跳转到外部连接
// }
export const staticRouters = [
  {path: '/login', name: 'login', meta: {title: 'Login - 登录', hideInMenu: true}, component: routerMap['Login']},
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
  {path: '/401', name: 'error_401', meta: {hideInMenu: true}, component: routerMap['Error401']},
  {path: '/500', name: 'error_500', meta: {hideInMenu: true}, component: routerMap['Error500']},
  {path: '*', name: 'error_404', meta: {hideInMenu: true}, component: routerMap['Error404']},
  {
    path: "/admin",
    name: "首页设置",
    meta: {
      icon: "logo-windows",
      title: "admin",
      access: ['super_admin'],
      // notCache: "true",
      hideInMenu: false
    },
    component: routerMap['Main'],
    children: [
      {
        path: "statistics",
        name: "statistics",
        meta: {
          icon: "md-analytics",
          access: ['super_admin'],
          title: "数据统计",

        },
        component: routerMap['Home']
      },
      {
        path: "homeSet",
        name: "homeSet",
        meta: {
          icon: "md-cog",
          title: "首页设置",
          access: ['super_admin'],
        },
        component: routerMap['homeSet']
      },
      {
        path: "recommend",
        name: "recommend",
        meta: {
          icon: "ios-contacts",
          title: "平台推荐",
          access: ['super_admin'],
        },
        component: routerMap['recommend']
      },
      {
        path: "referres",
        name: "referres",
        meta: {
          icon: "logo-yen",
          title: "用户推荐",
          access: ['super_admin'],
        },
        component: () => import('@/view/referres/list.vue')
      },
      {
        path: "userlist",
        name: "userlist",
        meta: {
          icon: "ios-contact",
          title: "用户列表",
          access: ['super_admin'],
        },
        component: () => import('@/view/users/list.vue')
      },
      {
        path: "userPay",
        name: "userPay",
        meta: {
          icon: "logo-usd",
          title: "用户充值",
          access: ['super_admin'],
        },
        component: () => import('@/view/userPay/list.vue')
      },
      {
        path: "orders",
        name: "orders",
        meta: {
          icon: "ios-paper",
          title: "用户订单",
          access: ['super_admin'],
        },
        component:  () => import('@/view/orders/list.vue')
      },
      {
        path: "redlove",
        name: "redlove",
        meta: {
          icon: "md-contacts",
          title: "红娘服务",
          access: ['super_admin'],
        },
        component: () => import('@/view/redlove/list.vue')
      },
      {
        path: "authentication",
        name: "authentication",
        meta: {
          icon: "ios-card",
          title: "实名认证",
          access: ['super_admin'],
        },
        component: () => import('@/view/authentication/list.vue')
      },
      {
        path: "beloved",
        name: "beloved",
        meta: {
          icon: "md-clipboard",
          title: "认证申请",
          access: ['super_admin'],
        },
        component:  () => import('@/view/beloved/list.vue')
      },
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
        path: 'complain',
        name: 'complain',
        meta: {
          title: '投诉列表',
          access: ['super_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/complain.vue')
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
  },
  {
    path: "/client",
    name: "客户",
    meta: {
      icon: "ios-ionic",
      title: "客户",
      hideInMenu: false
    },
    component: routerMap['Main'],
    children: [
      {
        path: "client",
        name: "client",
        meta: {
          icon: "ios-people",
          title: "我的客户",
        },
        component:  () => import('@/view/client/list.vue')
      }
    ]
  },
  {
    path: "/service",
    name: "服务",
    meta: {
      icon: "ios-ionic",
      title: "服务",
      hideInMenu: false
    },
    component: routerMap['Main'],
    children: [
      {
        path: "myService",
        name: "myService",
        meta: {
          icon: "logo-sass",
          title: "服务跟进",
        },
        component: () => import('@/view/myService/list.vue')
      }
    ]
  },
  {
    path: "/activity",
    name: "活动",
    meta: {
      icon: "ios-ionic",
      title: "活动",
      hideInMenu: false
    },
    component: routerMap['Main'],
    children: [
      {
        path: "activityList",
        name: "activityList",
        meta: {
          icon: "ios-wine",
          title: "活动列表",
        },
        component:  () => import('@/view/activity/list.vue')
      }
    ]
  }
]





