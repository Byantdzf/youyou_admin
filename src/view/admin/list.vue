<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab" style="margin-top: 12px;">
        <TabPane label="管理员列表" name="adminList">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 160px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;">搜索</Button>
                </span>
          <span @click="modalCode = true">
                        <Button type="success" style=" margin-bottom: 22px; float: right;">添加管理员</Button>
                    </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </TabPane>
      </Tabs>
      <Modal
        v-model="modalCode"
        title="权限配置"
        @on-ok="ok"
      >
        <Input
          v-model="name"
          placeholder="登录用户名"
          style="width: 51%; margin-bottom: 22px;"/>
        <Input
          v-model="mobile"
          placeholder="登录手机号"
          style="width: 51%; margin-bottom: 22px;"/><br/>
        <Input
          v-model="password"
          placeholder="登录密码"
          style="width: 51%; margin-bottom: 22px;"/>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import dropdown from '../components/dropdown'
  import Cookies from 'js-cookie'

  export default {
    name: 'authorization',
    components: {
      dropdown: dropdown
    },
    data () {
      return {
        name: '',
        mobile: '',
        password: '',
        multiple: false,
        activeTab: 'score',
        workerTotal: 0,
        search: '',
        addInformation: [],
        searchKeyword: '', // 搜索
        orgTotal: 0, // 分页
        userList: [], // 用户列表
        referresID: '', // 充值用户
        id: '',
        modalCode: false,
        baseData: [],
        orgColumns: [
          {
            title: 'UserID',
            key: 'id',
            align: 'center',
            width: 100,
            editable: true
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: '手机号',
            key: 'mobile',
            align: 'center',
            editable: true
          },
          {
            title: '性别',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.sex == 1 ? '男' : '女')
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '温馨提示',
                        content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除权限?</p>`,
                        onOk: () => {
                          this.removeAdmin(params.row.id, params.index)
                        },
                        onCancel: () => {
                          console.log('点击了取消')
                        }
                      })
                    }
                  }
                }, '删除管理员')
              ])
            }
          }
        ],
        modal: false,
        information: [],
        title: '',
        addAdminId: 0,
        paasList: [],
        paasID: '',
        paasName: '',
        loading: false
      }
    },
    methods: {
      changeTree (val) {
        if (val && val[0].title) {
          if (val[0].title === '超级管理员') return this.paasName = 'super'
          for (let item of this.paasList) {
            if (item.title === val[0].title) {
              this.paasID = item.id
              this.paasName = item.name
            }
          }
        }
      },
      ok () {
        let vm = this
        if (!vm.name) {
          return vm.$Message.error('请输入名字！')
        } else if (!vm.mobile) {
          return vm.$Message.error('请输入手机号！')
        } else if (!vm.password) {
          return vm.$Message.error('请输入登录密码！')
        }
        uAxios.post(`admin/admins`, {name: vm.name, mobile: vm.mobile, password: vm.password})
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              vm.$Message.success('添加成功！')
              vm.getlist()
            }
          }).catch(() => {
          vm.$Message.error(result.message)
        })
      },
      removeAdmin (id, index) {
        uAxios.delete(`admin/users/${id}/admin`)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.information.splice(index, 1)
              this.$Message.success('删除成功！')
            }
          }).catch(() => {
          this.$Message.error(res.message)
        })
      },
      getTab (type) {
        this.activeTab = type
      },
      handlePage (num) { // 分页
        this.getlist(num)
      },
      getlist (page = 1) {
        let self = this
        self.loading = true
        uAxios.get(`admin/admins?page=${page}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            if (result.data) {
              self.information = result.data
              self.orgTotal = result.total
            }
            self.loading = false
          })
      },
      handleSearch () {
        this.getlist(1)
      }
    },
    mounted () {
      this.getlist()
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold;
  }

  .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    background-color: #d5e8fc;
    position: relative;
    padding-right: 22px;

    &:after {
      content: '';
      position: absolute;
      right: 4px;
      top: 5px;
      width: 12px;
      height: 18px;
      background-image: url("http://images.ufutx.com/201905/15/c09ba0a5ed976879bc389cc9cfd8c43a.png");
      background-size: contain;
      background-repeat: no-repeat;
    }

    /*box-shadow: 1px 1px 12px #d3d3d3;*/
  }
</style>
