<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane label='未完善资料' name="0">
          <Input
            v-model="searchKeyword"
            @on-enter="createLabel"
            placeholder="搜索用户..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="createLabel">
                <Button type="primary" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;">搜索</Button>
              </span>
          <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </TabPane>
        <TabPane label='已完善资料' name="1">
          <Input
            v-model="searchKeyword"
            @on-enter="createLabel"
            placeholder="搜索用户..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="createLabel">
                <Button type="primary" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;">搜索</Button>
              </span>
          <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="OK"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否确认删除该用户？</p>
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import uAxios from '../../api/index'
  import config from '../../api/config'

  // import moment from 'moment';

  export default {
    search: '',
    data () {
      return {
        activeTab: '0',
        currentPage: 1,
        searchKeyword: '',
        modal: false, // 弹
        // 框
        orgTotal: 0,
        id: '',
        total: '',
        Columns: [
          {
            title: 'ID',
            align: 'center',
            key: 'id',
            width: 80
          },
          {
            title: '头像',
            key: 'updatedAt',
            width: 80,
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.avatar
                },
                style: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  marginTop: '6px',
                  border: '4px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'user_detail',
                      params: argu
                    })
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'mobile',
            width: 120
          },
          {
            title: '性别',
            align: 'center',
            key: 'sex'
          },
          {
            title: '是否屏蔽',
            align: 'center',
            render: (h, params) => {
              let is_shielded = params.row.is_shielded
              return h('span', is_shielded==1?'已屏蔽':'未屏蔽')
            }
          },
          {
            title: '加入时间',
            align: 'center',
            key: 'created_at'
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {id: params.row.id}
                      this.$router.push({
                        name: 'user_detail',
                        params: argu
                      })
                    }
                  }
                }, '用户详情')
              ])
            }
          }
        ],
        value: '',
        information: [],
        loading: false,
        type: ''
      }
    },
    watch: {},
    methods: {
      createLabel () {
        console.log(this.searchKeyword)
        this.page = 1
        this.getlist(1)
      },
      deleteUser () {
        let self = this
        self.$Modal.confirm({
          title: '系统提示',
          content: '<p>是否确认删除？</p>',
          onOk: () => {
            uAxios.delete('admin/users/' + self.id).then((response) => {
              if (response.data.code === 0) {
                this.$Message.info('删除成功')
                this.getlist(this.currentPage)
              } else {
                this.$Modal.error({
                  content: response.data.message
                })
              }
            })
          }
        })
      },
      getTab (type) { // 获得激活的Tab页
        this.activeTab = type
        this.getlist()
      },
      handlePage (num) {
        // 分页
        this.getlist(num)
      },
      getlist (page=1) {
        let self = this
        uAxios.get(`admin/users?page=${page}&keyword=${self.searchKeyword}&is_completed=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            self.total = res.data.data.total
            self.information = result.data.map((item) => {
              return {
                avatar: item.avatar,
                created_at: item.created_at,
                id: item.id,
                mobile: item.mobile,
                name: item.name,
                sex: item.sex == 2 ? '女' : '男',
                is_shielded: item.is_shielded,
              }
            })
            self.orgTotal = result.total
            self.loading = false
          }).catch(() => {
          self.loading = false
        })
      }
    },
    mounted () {
      this.getlist(1)
    }
  }
</script>

<style lang="less">
  /*@import "../../styles/common";*/
</style>
