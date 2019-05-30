<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane label="未处理" name="0">
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
        <TabPane label="已处理" name="1">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;">搜索</Button>
                </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      v-model="modal"
      title="反馈内容"
      :ok-text="text"
      @on-ok="cancel"
    >
      <Card style="margin-top: 12px;">
        <p style="border-bottom: 4px solid #eeeeee;padding-bottom: 12px;margin-bottom: 16rpx;">
          内容：{{feedbackItem.content}}</p>
        <span v-for="(item,index) in feedbackItem.photos" style="margin: 0 10px;">
						<img :src="item" alt="" width="80rpx" @click="showModel(item)">
					</span>
      </Card>
    </Modal>
    <Modal
      v-model="modal1"
      title="反馈照片"
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
    name: 'feedbacks',
    data () {
      return {
        activeTab: 0,
        currentPage: 1,
        searchKeyword: '',
        orgTotal: 0,
        fieldList: [],
        modelValue: '',
        industryList: [],
        id: '',
        addressList: [],
        modal1: false,
        image: '',
        text: '标记为已处理',
        orgColumns: [
          {
            title: '处理ID',
            width: 80,
            key: 'feedbackId',
            align: 'center',
          },
          {
            title: '反馈人ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '反馈人',
            key: 'user_name',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '反馈人头像',
            key: 'user_avatar',
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
            title: '联系方式',
            key: 'user_mobile',
            align: 'center',
            editable: true
          },
          {
            title: '反馈内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '反馈时间',
            key: 'created_at',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
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
                      this.feedbackItem = params.row
                      this.feedbackIndex = params.index
                      // console.log(params.index)
                    }
                  }
                }, '查看反馈详情')
              ])
            }
          }
        ],
        modal: false,
        value: '',
        information: [],
        feedbackItem: {},
        feedbackIndex: 0,
        title: '',
        msgBiz: '',
        loading: false,
        brokerLecturerData: []
      }
    },
    watch: {
      activeTab () {
        console.log(this.activeTab)
        if (this.activeTab == 1) {
          return this.text = '标记为未处理'
        }
        this.text = '标记为已处理'
      }
    },
    methods: {
      cancel () {
        this.modal = false
        let status = 1
        if (this.activeTab == 1) {
          status = 0
        }
        uAxios.put(`admin/change/feedback/${this.feedbackItem.feedbackId}/status?status=${status}`)
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
        uAxios.get(`admin/feedbacks?page=${page}&status=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            console.log(result,'1231')
            self.information = result.data.map((item, inde, arr) => {
              return {
                content: item.content,
                created_at: item.created_at,
                feedbackId: item.id,
                photos: item.photos,
                status: item.status,
                updated_at: item.updated_at,
                id: item.user.id,
                user_name: item.user.name,
                user_avatar: item.user.circle_avatar,
                user_mobile: item.user.mobile
              }
            })
            self.orgTotal = result.total
            self.loading = false
            // self.searchKeyword = ''
          })
      },
      showModel (item) {
        this.modal1 = true
        this.image = item
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
        uAxios.get(`admin/feedbacks?page=${page}&${query}&status=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            self.orgTotal = result.total
            self.searchKeyword = ''
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
