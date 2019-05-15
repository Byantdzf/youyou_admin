import { login, logout } from '@/api/user'
import { getRouterReq } from '@/api/routers'
import { setToken, routersConfigAssembly, setLocalStorage, delLocalStorage, delToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: '',
    access: '',
    paas: {}
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
      setLocalStorage('avator', avatorPath)
    },
    setPaas (state, paas) {
      state.paas = paas
      setLocalStorage('paas', paas?paas.title: '')
    },
    setUserId (state, id) {
      state.userId = id
      setLocalStorage('id', id)
    },
    setUserName (state, name) {
      state.userName = name
      setLocalStorage('name', name)
    },
    setAccess (state, access) {
      state.access = access
      setLocalStorage('access', access)
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data.data
          commit('setToken', data.access_token)
          commit('setAvator', data.avatar)
          commit('setPaas', data.paas_obj)
          commit('setUserName', data.name)
          commit('setUserId', data.id)
          commit('setAccess', [data.admin_type])
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('setAvator', '')
          commit('setPaas', '')
          commit('setUserName', '')
          commit('setUserId', 0)
          delLocalStorage('id')
          delLocalStorage('name')
          delLocalStorage('paas')
          delLocalStorage('avator')
          delLocalStorage('access')
          delToken()
          resolve()
        }).catch(err => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('setAvator', '')
          commit('setPaas', '')
          commit('setUserName', '')
          commit('setUserId', 0)
          delLocalStorage('id')
          delLocalStorage('name')
          delLocalStorage('paas')
          delLocalStorage('avator')
          delLocalStorage('access')
          delToken()
          reject(err)
        })
      })
    },
    // 获取用户路由
    getRoutersConfig ({ state, commit }) {
      return getRouterReq().then((routersData) => {
        let routersConfig = _.cloneDeep(routersData.data)
        let newRoutersConfigObj = routersConfigAssembly(routersConfig)
        commit('setRoutersConfig', { newRouters: newRoutersConfigObj, routersData: routersData.data })
        return newRoutersConfigObj
      })
    }

  }
}
