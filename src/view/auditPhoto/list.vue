<template>
  <div v-model="activeTab">
    <Tabs @on-click="getTab">
      <TabPane :label="item.title" :name="item.jump" v-for="item,index in tab" :key="index">
        <Input
          v-model="searchKeyword"
          @on-enter="createLabel"
          placeholder="搜索用户..."
          style="width: 200px; margin-bottom: 22px;"/>
        <span @click="createLabel">
          <Button type="primary" icon="ios-search" style="margin-bottom: 22px; margin-left: 12px;">搜索</Button>
        </span>
        <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15" style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal1"
      title="温馨提示"
      @on-ok="ok"
    >
      <p>是否执行该操作？</p>
    </Modal>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="OK"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否标记为审核失败？</p>
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
    name: 'auditPhoto',
    data () {
      return {
        activeTab: '-1',
        tab: [{title: '未审核', jump: '-1'}, {title: '已审核', jump: '1'}],
        currentPage: 1,
        searchKeyword: '',
        modal: false, // 弹框
        orgTotal: 0,
        id: '',
        modal1: false,
        social: '',
        total: '',
        cost: '',
        count: [],
        Columns: [
          {
            title: 'ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'mobile'
          },
          {
            title: '头像',
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
            title: '性别',
            align: 'center',
            width: 80,
            key: 'sex'
          },
          {
            title: '单身/介绍人',
            align: 'center',
            key: 'type'
          },
          {
            title: '加入时间',
            align: 'center',
            key: 'created_at'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (this.activeTab == '-1') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.cost = '1'
                        this.id = params.row.id
                        this.modal1 = true
                        this.Index = params.index
                      }
                    }
                  }, '同意申请'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.cost = '-1'
                        this.id = params.row.id
                        this.modal1 = true
                        this.Index = params.index
                      }
                    }
                  }, '拒绝申请'),
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.showPhoto(params.row.avatar)
                      }
                    }
                  }, '查看头像')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.id = params.row.id
                        this.modal = true
                        this.Index = params.index
                      }
                    }
                  }, '删除佳偶'),
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.showPhoto(params.row.avatar)
                      }
                    }
                  }, '查看头像')
                ])
              }
            }
          }
        ],
        Index: 0,
        value: '',
        information: [],
        loading: false,
        type: ''
      }
    },
    watch: {},
    methods: {
      showPhoto (photo) {
        this.$Modal.success({
          title: `审核头像`,
          content: `<img src="${photo}" width="100%"/>`
        });
      },
      ok () {
        let self = this,
          data = {
            is_photo_audited: this.cost
          }
        uAxios.put(`admin/audit/users/${self.id}/photo`, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('操作成功')
            this.information.splice(this.Index,1)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      createLabel () {
        console.log(this.searchKeyword)
        this.page = 1
        this.getlist(1)
      },
      filterLabel (page) {
        console.log(this.social)
        if (this.social == 1 || this.social == 2) {
          this.type = 'single'
        } else {
          this.type = 'marriage'
        }
        this.page = 1
        this.getlist(1)
      },
      deleteUser () {
        this.cost = '-1'
        this.ok()
      },
      getTab (type) { // 获得激活的Tab页
        this.activeTab = type
        this.getlist(1)
      },
      handlePage (num) { // 分页
        this.currentPage = num
        if (this.social.length == 0) {
          this.getlist(num)
        } else {
          this.filterLabel(num)
        }

      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get('admin/audit/users/photo?page=' + page + '&keyword=' + self.searchKeyword + '&is_photo_audited=' + self.activeTab)
          .then(res => {
            let result = res.data.data
            self.total = res.data.data.total
            self.information = result.data.map((item) => {
              return {
                avatar: item.photo,
                created_at: item.created_at,
                id: item.id,
                mobile: item.mobile,
                name: item.name,
                sex: item.sex == 1 ? '男' : '女',
                rank: item.rank,
                type: item.type == 'single' ? '单身' : '介绍人',
                is_good_match: item.is_good_match == '0' ? '未认证' : '已认证',
                address: `${item.province}${item.city}` == '' ? '暂无' : `${item.province} ${item.city}`
              }
            })
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
      handleSearch () {
        let query = '&keyword=' + this.searchKeyword
        let self = this
        let page = 1
        uAxios.get('posts?page=' + page + query)
          .then(res => {
            let result = res.data.data
            self.orgData = result.data
            console.log(self.orgData)
            self.orgTotal = result.total
            // self.searchKeyword = ''
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
