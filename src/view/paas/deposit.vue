<template>
  <div v-model="activeTab">
    <Tabs>
      <TabPane label="提现余额" name="balance">
        <Card>
          <p slot="title">提现信息</p>
          <div class="_bc-box">
            <p style="display: inline-flex" class="_bc-p">提现账号：</p>
            <span v-if="!information.user">
              <p style="padding: 12px;display: inline-flex;" v-if="!user.photo">暂无账号信息...</p>
              <p v-else style="display: inline-flex;margin-bottom: 12px;">
                <div :style="'background-image: url('+user.photo+')'" class="image" v-if="user.photo"></div>
                <span v-if="user.name">姓名：{{user.name}}</span>
              </p>
              <i-button type="warning" class="primary" @click="showPaasList = !showPaasList">{{showPaasList?'收起列表':'选择提现账号'}}</i-button>
              <Card style="margin-bottom: 12px;overflow: hidden;" v-if="showPaasList">
                <i-table border :columns="columns1" :data="data1"></i-table>
                <Page :total="total" style="margin:12px 0; float: right;" @on-change="handlePageV"
                      :page-size="15"></Page>
              </Card>
            </span>
          </div>
          <hr/>
          <br/>
          <div class="_bc-box">
            <p class="_bc-p">活动余额：</p>
            <count-up
              class="infor-card-count user-created-count"
              id-name="idName"
              :end-val="activity_balance"
              :color="green"
              countSize="32px"
              :countWeight="countWeight"
            >
            </count-up>
          </div>
          <div class="_bc-box" style="width: 50%">
            <p class="_bc-p">活动已提现：</p>
            <count-up
              class="infor-card-count user-created-count"
              id-name="idName1"
              :end-val="activity_withdraw"
              :color="red"
              countSize="32px"
              :countWeight="countWeight"
            >
            </count-up>
          </div>
          <i-button type="primary" class="primary" @click="withdraw('ACTIVITY')">活动余额 提现</i-button>
          <hr/>
          <br/>

          <div class="_bc-box">
            <p class="_bc-p">会员余额：</p>
            <count-up
              class="infor-card-count user-created-count"
              id-name="idName2"
              :end-val="vip_balance"
              :color="green"
              countSize="32px"
              :countWeight="countWeight"
            >
            </count-up>
          </div>
          <div class="_bc-box" style="width: 50%">
            <p class="_bc-p">会员已提现：</p>
            <count-up
              class="infor-card-count user-created-count"
              id-name="idName3"
              :end-val="vip_withdraw"
              :color="red"
              countSize="32px"
              :countWeight="countWeight"
            >
            </count-up>
          </div>
          <i-button type="primary" class="primary" @click="withdraw('RANK')">会员余额 提现</i-button>
          <hr/>
        </Card>
      </TabPane>
      <TabPane label="提现记录" name="complain">
        <Input
          v-model="searchKeyword"
          @on-enter="handleSearch"
          placeholder="关键字搜索..."
          style="width: 200px; margin-bottom: 22px;"/>
        <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
        <Card>
          <p slot="title">推荐列表</p>
          <Table :loading="loading" :columns="orgColumns" :data="historys" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;"></Page>
          <div style="clear: both"></div>
        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import countUp from './components/countUp.vue'

  export default {
    props: {
      countSize: {
        type: String,
        default: '26px'
      },
    },
    components: {
      countUp
    },
    data () {
      return {
        endVal: 0.01,
        red: 'red',
        green: '#05ab05',
        countWeight: 700,
        activeTab: 'complain',
        currentPage: 1,
        searchKeyword: '',
        orgTotal: 0,
        total: 0,
        showPaasList: false,
        id: '',
        columns1: [
          {
            title: '选择账号',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Checkbox', {
                  props: {
                    value: params.row.active
                  },
                  on: {
                    'on-change': (val) => {
                      for (let item of this.data1) {
                        item.active = false
                      }
                      this.data1[params.index].active = true
                      this.user = this.data1[params.index]
                      console.log(this.data1)
                      console.log(this.user)
                      console.log(val, 11)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '用户ID',
            key: 'id',
            align: 'center',
            editable: true
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: '头像',
            key: 'avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.photo
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
            width: 80,
            align: 'center'
          },
          {
            title: '性别',
            key: 'sex',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', params.row.sex == '1' ? '男' : '女')
              ])
            }
          },
          {
            title: '单身/介绍人',
            key: 'type',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.type == 'single' ? '单身' : '介绍人')
            }
          }
        ],
        data1: [],
        orgColumns: [
          {
            title: '用户ID',
            key: 'id',
            align: 'center',
            editable: true
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: '头像',
            key: 'avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.circle_avatar
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
            width: 80,
            align: 'center'
          },
          {
            title: '性别',
            key: 'sex',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', params.row.sex == '1' ? '男' : '女')
              ])
            }
          },
          {
            title: '单身/介绍人',
            key: 'type',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.type == 'single' ? '单身' : '介绍人')
            }
          },
          {
            title: '会员等级',
            key: 'rank_name',
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
                    type: 'primary'
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
                }, '查看信息')
              ])
            }
          }
        ],
        information: [],
        activity_balance: 0, activity_withdraw: 0, vip_balance: 0, vip_withdraw: 0,
        historys: [],
        user: {},
        loading: false
      }
    },
    methods: {
      withdraw (type) {
        uAxios.post(`admin/paas/withdraw?type=${type}`)
          .then(res => {
            let result = res.data.data
            if(result.code === 0){
              this.$Message.info('操作成功,注意查收！')
            }else{
              this.$Message.error(result.message)
            }
          })
      },
      handlePage (num) {
        // 分页
        this.currentPage = num
        this.getlist(num)
      },
      handlePageV (num) {
        this.getPaasList(num)
      },
      getlist (page) {
        let self = this
        let query = '&keyword=' + this.searchKeyword
        self.loading = true
        uAxios.get('admin/users/' + self.id + '/invite/users?page=' + page + query)
          .then(res => {
            let result = res.data.data
            self.history = result.data
            self.orgTotal = result.total
            self.loading = false
          })
      },
      getPaasList (page) {
        let self = this
        uAxios.get('admin/paas/admins')
          .then(res => {
            let result = res.data.data
            self.data1 = result.data.map((item) => {
              item.user.active = false
              return item.user
            })
            self.total = result.total
            console.log(result)
          })
      },
      getInformation () {
        let self = this
        uAxios.get('admin/paas/account')
          .then(res => {
            let result = res.data.data
            self.information = result
            self.activity_balance = Number(result.activity_balance)
            self.activity_withdraw = Number(result.activity_withdraw)
            self.vip_balance = Number(result.vip_balance)
            self.vip_withdraw = Number(result.vip_withdraw)
          })
      },
      handleSearch () {
        this.getlist(1)
      }
    },
    mounted () {
      this.getInformation()
      this.getPaasList()
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

  ._bc-box {
    font-weight: bold;
    overflow: hidden;
    position: relative;

    ._bc-p {
      width: 120px;
      padding: 12px;
      text-align: justify;
      text-align-last: justify;
      display: inline-block;
      float: left;
    }
  }

  .primary {
    float: right;
    margin-top: -44px;
  }

  .user-created-count {
    display: inline-flex;
  }

  .image {
    width: 60px;
    height: 60px;
    display: inline-flex;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 12px;
    border-radius: 50px;
  }
</style>
