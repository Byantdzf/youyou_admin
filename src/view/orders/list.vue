<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane :label="item.title" :name="item.jump" v-for="item,index in tab" :key="index">
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
      v-model="modal1"
      title="温馨提示"
      @on-ok="ok"
    >
      <p>是否确定删除该公众号？</p>
    </Modal>
    <Modal
      v-model="modal"
      title="编辑公众号"
      @on-ok="cancel"
    >
      <Input v-model="value" placeholder="Enter something..." style="width: 300px"></Input>
    </Modal>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import Cookies from 'js-cookie'

  export default {
    search: '',
    name: 'orders',
    data () {
      return {
        tab: [
          {title: '全部', jump: ''},
          {title: '福分充值', jump: 'score'},
          {title: 'VIP充值', jump: 'rank'},
          {title: '兑换商品', jump: 'goods'},
          {title: '赠送礼物', jump: 'gift'},
          {title: '奉献金', jump: 'donation'},
          {title: '见面服务', jump: 'active'},
          {title: '托管服务', jump: 'passive'},
          {title: '活动', jump: 'activity'},
          {title: '实名认证', jump: 'approve'},
        ],
        activeTab: '',
        currentPage: 1,
        searchKeyword: '',
        orgTotal: 0,
        fieldList: [],
        modelValue: '',
        industryList: [],
        id: '',
        addressList: [],
        modal1: false,
        orgColumns: [
          {
            title: '序号',
            type: 'index',
//                        width: 80,
            align: 'center',
            sortable: true
          },
          {
            title: 'ID',
            key: 'id',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '用户名',
            key: 'user_name',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '头像',
            key: 'avatar',
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
            width: 80,
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'goods',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '消费类型',
            key: 'type',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '支付状态',
            key: 'status',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '金额',
            key: 'price',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '消费时间',
            key: 'created_at',
            align: 'center',
//                        width: 100,
            editable: true
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
                      console.log(params.row.id)
                      let argu = {id: params.row.id}
                      this.$router.push({
                        name: 'order-detail',
                        params: argu
                      })
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        modal: false,
        value: '',
        information: [],
        title: '',
        msgBiz: '',
        loading: false,
        brokerLecturerData: []
      }
    },
    methods: {
      ok () {
        let self = this
        console.log(self.id)
        uAxios.delete('profiles/' + self.id).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('删除成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      cancel () {
        console.log(this.value)
        let self = this
        let data = {
          title: this.value,
          msgBiz: this.msgBiz
        }
        uAxios.put('profiles/' + self.id, data).then((response) => {
          if (response.data.code === 0) {
//                      this.$Modal.error({
//                          content: '删除成功'
//                      });
            this.$Message.info('修改成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getlist(1)
      },
      handlePage (num) {
        // 分页
        this.currentPage = num
        this.getlist(num)

      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get('admin/orders?page=' + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data.map((item) => {
              var type = ''
              switch (item.type) {
                case 'score':
                  type = '福分充值'
                  break
                case 'rank':
                  type = 'VIP充值'
                  break
                case 'other_rank':
                  type = '替人VIP充值'
                  break
                case 'goods':
                  type = '兑换商品'
                  break
                case 'donation':
                  type = '奉献金'
                  break
                case 'active':
                  type = '见面服务'
                  break
                case 'passive':
                  type = '托管服务'
                  break
                case 'activity':
                  type = '活动'
                  break
                case 'approve':
                  type = '实名认证'
                  break
//                                default:
//                                    type='赠送礼物';
              }
              return {
                user_name: item.user_name,
                avatar: item.avatar,
                type: type,
                goods: item.goods,
                created_at: item.created_at,
                id: item.id,
                id: item.id,
                status: item.status,
                price: item.price
              }
            })
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
            // self.searchKeyword = ''
          }).catch(() => {
          self.loading = false
        })
      },
      remove (index, _id) {
        this.information.splice(index, 1)
        console.log(_id)
        uAxios.delete('profiles/' + _id)
          .then(res => {
            this.$Message.info('删除成功')
          })
      },
      handleSearch () {
        this.getlist(1)
      }
    },
    mounted () {
      this.getlist('1')
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
