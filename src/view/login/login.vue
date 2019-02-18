<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="md-heart-outline" title="福恋智能后台管理系统" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit" :load="loading"></login-form>
                    <p class="login-tip">【福恋智能】 -- 后台
                      <span  style="float: right;" @click="goRegister">去注册</span>
                    </p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form'
import config from '@/libs/api.request'
import { mapActions } from 'vuex'

export default {
  components: {
    LoginForm
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    goRegister () {
      let URL = config.baseUrl.split('api')[0]
      window.open(URL + 'register')
    },
    ...mapActions([
      'handleLogin',
      'getRoutersConfig'
    ]),
    handleSubmit ({ userName, password }) {
      const _this = this
      _this.loading = true
      _this.handleLogin({ userName, password }).then(res => {
        console.log(res)
        if (res.code === 1) {
          setTimeout(() => {
            _this.loading = false
            _this.$Message.error(res.data.message || '系统错误')
          }, 1000)
        } else if (res.code === 2) {
          setTimeout(() => {
            _this.loading = false
            _this.$Message.error(res.data.message || '你尚未注册')
          }, 1000)
        } else {
          // if (res.data.is_admin !== 1) {
          //   return _this.$Message.error('抱歉！你没有权限访问后台系统')
          // }
          _this.$Message.loading({
            content: '登录系统中...',
            duration: 1.5,
            onClose: function () {
              _this.loading = false
              Promise.all([_this.getRoutersConfig()]).then(res => {
                // 注册新路由配置
                _this.$router.addRoutes(res[0])
                _this.$router.push({
                  name: 'home'
                })
              })
            }
          })
        }
      }).catch(err => {
        setTimeout(() => {
          console.log('err', err)
          _this.loading = false
          _this.$Message.error(err.response.data.message || '系统错误')
        }, 1000)
      })
    }
  }
}
</script>

<style>

</style>
