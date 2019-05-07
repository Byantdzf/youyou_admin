// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import VueAMap from 'vue-amap'
import {lazyAMapApiLoaderInstance} from 'vue-amap'

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'cb272bd52971913f1b6c4dbce3269e9b',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

// VueAMap.initAMapApiLoader({
//   key: '',
//   plugin: [
//     'AMap.Autocomplete', //输入提示插件
//     'AMap.PlaceSearch', //POI搜索插件
//     'AMap.Scale', //右下角缩略图插件 比例尺
//     'AMap.OverView', //地图鹰眼插件
//     'AMap.ToolBar', //地图工具条
//     'AMap.MapType', //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
//     'AMap.PolyEditor', //编辑 折线多，边形
//     'AMap.CircleEditor', //圆形编辑器插件
//     'AMap.Geolocation' //定位控件，用来获取和展示用户主机所在的经纬度位置
//   ]
// })
// import '@/mock'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
