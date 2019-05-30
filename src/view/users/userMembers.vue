<template>
  <div v-model="activeTab">
    <Tabs>
      <TabPane label="用户会员记录" name="complain">
        <Col span="24">
          <!--<Input-->
            <!--v-model="searchKeyword"-->
            <!--@on-enter="handleSearch"-->
            <!--placeholder="关键字搜索..."-->
            <!--style="width: 200px; margin-bottom: 22px;"/>-->
          <!--<span @click="handleSearch">-->
                    <!--<Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12rpx;">搜索</Button>-->
                <!--</span>-->
          <Row>
            <Col span="11">
              <Card>
                <p slot="title">用户信息</p>
                <div style="display: inline-block">
                  <span class="font_16 _bold">头像：<img :src="photo" alt="" width="80rpx"
                                                      style="box-shadow: 1px 1px 12px #c1c1c1"></span>
                </div>
                <div style="display: inline-block;margin-left: 22px;">
                  <span class="font_16 _bold">用户名：</span>
                  <span class="font_16">{{name}}</span>
                </div>
                <div style="display: inline-block;margin-left: 12px;">
                  <span class="font_1 _bold">手机号：</span>
                  <span class="font_16">{{mobile}}</span>
                </div>
              </Card>
            </Col>
          </Row>
          <Row style="margin-top:22px;">
            <Col span="24">
              <Card>
                <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
                <!--<Page :total="orgTotal" @on-change="handlePage" :page-size="15"-->
                      <!--style="float:right;margin-top:5px;"></Page>-->
                <!--<div style="clear: both"></div>-->
              </Card>
            </Col>
          </Row>
        </Col>
      </TabPane>
    </Tabs>
    <Modal
    v-model="modal"
    title="修改到期时间"
    @on-ok="cancel"
    >
      <p style="color: #000000;font-size: 14px">
        到期时间：
        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="Select date and time(Excluding seconds)" style="width: 200px"></DatePicker>
      </p>
    </Modal>
    <Modal
    v-model="modaldelete"
    ok-text="OK"
    title="温馨提示"
    @on-ok="ok"
    >
    <p>是否确定删除该会员？</p>
    </Modal>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    search: '',
    name: 'index',
    data () {
      return {
        cancel: true,
        activeTab: 'complain',
        name: '',
        mobile: '',
        photo: '',
        id: '',
        modaldelete: false,
        orgColumns: [
          {
            title: '序号',
            type: 'index',
            width: 100,
            align: 'center',
            sortable: true
          },
          {
            title: '会员ID',
            key: 'id',
            align: 'center',
            width: 110,
            editable: true
          },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center',
            width: 110,
            editable: true
          },
          {
            title: 'VIP类型',
            key: 'rank_name',
            width: 120,
            align: 'center'
          },
          {
            title: 'VIP类型',
            key: 'type',
            width: 120,
            align: 'center'
          },
          {
            title: '会员价格',
            key: 'price',
            width: 120,
            align: 'center'
          },
          {
            title: '购买时间',
            key: 'created_at',
            width: 200,
            align: 'center'
          },
          {
            title: '到期时间',
            key: 'deadline',
            width: 200,
            align: 'center'
          },
          {
            title: '会员详情',
            key: 'content',
            width: 200,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            // width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px',
                    background: '#d95233',
                    border: 'none'
                  },
                  on: {
                    click: () => {
                      this.modal = true
                    }
                  }
                }, '会员添加'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px',
                    background: '#d9d226',
                    border: 'none'
                  },
                  on: {
                    click: () => {
                      this.modal = true
                    }
                  }
                }, '会员修改'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px',
                    background: '#a328d9',
                    border: 'none'
                  },
                  on: {
                    click: () => {
                      this.modaldelete = true
                    }
                  }
                }, '会员删除')
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
      getlist () {
        let self = this
        console.log(self.id)
        uAxios.get('admin/users/' + self.id + '/rank/histories')
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.name = result.user.name
            self.photo = result.user.photo
            self.mobile = result.user.mobile
            self.information = result.histories.map((item) => {
              return {
                id: item.id,
                deadline: item.deadline,
                price: item.rank.price+'/月',
                rank_name: item.rank.name+'VIP',
                created_at: item.rank.created_at,
                content: item.rank.content,
                type: item.rank.type,
                user_id: item.user_id
              }
            })
            self.loading = false
          })
        self.loading = true
      },
      ok () {
        let self = this
        uAxios.delete('admin/users/' + self.id ).then((response) => {
          if (response.data.code === 1) {
            this.$Message.info('删除成功');
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            });
          }
        });
      },
    },
    mounted () {
      this.id = this.$route.params.id
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
