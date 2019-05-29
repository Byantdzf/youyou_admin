<template>
  <div>
    <p>用户会员类型</p>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    name: 'userMembers',
    data () {
      return {}
    },
    methods: {
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/feedbacks?page=${page}&status=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
          })
      },
    },
    mounted () {
      // this.getlist(1)
    }
  }
</script>

<style lang="less">
</style>
