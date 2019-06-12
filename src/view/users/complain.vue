<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane  :label="item.title" :name="item.jump" v-for="item,index in tab" :key="index">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      v-model="modal"
      title="投诉内容"
      :ok-text="text"
      @on-ok="cancel"
    >
      <Card style="margin-top: 12px;">
        <p style="border-bottom: 4px solid #eeeeee;padding-bottom: 12px;margin-bottom: 16rpx;">
          内容：{{complainItem.content}}</p>
        <span v-for="(item,index) in complainItem.photos" style="margin: 0 10px;">
						<img :src="item" alt="" width="80rpx" @click="showModel(item)">
					</span>
      </Card>
    </Modal>
    <Modal
      v-model="modal1"
      title="投诉照片"
      no-cancel>
      <div style="font-size: 16px">
        <div style="text-align: center">
          <img :src="image" style="width: 400px;"/>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    search: '',
    name: 'complain',
    data () {
      return {
        activeTab: 'complain',
        currentPage: 1,
        searchKeyword: '',
        orgTotal: 0,
        fieldList: [],
        modelValue: '',
        industryList: [],
        id: '',
        addressList: [],
        modal1: false,
        text: '标记为已处理',
        complainItem: {},
        orgColumns: [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center',
            sortable: true
          },
          {
            title: '投诉人ID',
            align: 'center',
            width: 100,
            key: 'id'
          },
          {
            title: '投诉人',
            key: 'user_name',
            align: 'center',
            editable: true
          },
          {
            title: '投诉人头像',
            key: 'headimg',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.user_avatar
                },
                style: {
                  width: '42px',
                  height: '42px',
                  marginTop: '6px',
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.user_id}
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
            title: '被投诉人ID',
            align: 'center',
            key: 'complaint_id'
          },
          {
            title: '被投诉人',
            key: 'complaint_name',
            align: 'center',
            editable: true
          },
          {
            title: '被投诉人头像',
            key: 'headimg',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.complaint_avatar
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
                    let argu = {id: params.row.complaint_id}
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
            title: '投诉时间',
            key: 'created_at',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  on: {
                    click: () => {
                      this.modal = true
                      this.complainItem = params.row
                    }
                  }
                }, '查看投诉详情')
              ])
            }
          }
        ],
        modal: false,
        value: '',
        image: '',
        information: [
          {id: 250, updatedAt: '数据缺失'},
          {id: 256, updatedAt: '数据缺失'},
          {id: 257, updatedAt: '数据缺失'}
        ],
        tab: [{title: '未处理', jump: '0'}, {title: '已处理', jump: '1'}],
        title: '',
        msgBiz: '',
        loading: false,
        brokerLecturerData: []
      }
    },
    methods: {
      showModel (item) {
        this.modal1 = true
        this.image = item
      },
      cancel () {
        this.modal = false
        let status = 1
        if (this.activeTab == 1) {
          status = 0
        }
        uAxios.put(`admin/change/complaint/${this.complainItem.id}/status?status=${status}`)
          .then(res => {
            if (res.data.code === 0) this.$Message.info('已处理')
            this.information.splice(this.feedbackIndex, 1)
          })
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getlist(1)
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/complaints?page=${page}&status=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            self.orgTotal = result.total
            self.loading = false
            self.tab = [{title: (h) => {
                return h('div', [
                  h('span', '未处理'),
                  h('Badge', {
                    props: {
                      count: self.orgTotal
                    }
                  })
                ])
              }, jump: '0'}, {title: '已处理', jump: '1'}]
            // self.searchKeyword = ''
          })
      },
      handlePage (num) {
        // 分页
        this.currentPage = num
        this.getlist(num)
      },
      handleSearch () {
        // 搜索
        let query = 'keyword=' + this.searchKeyword
        let self = this
        let page = 1
        uAxios.get(`admin/complaints?page=${page}&status=${self.activeTab}&${query}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            self.orgTotal = result.total
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
  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
    height: 120px;
    margin-top: -16px;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
  }

  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-radius: 0;
    background: #fff;
  }

  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-top: 1px solid #3399ff;
  }

  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
