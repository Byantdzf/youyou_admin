<template>
  <div v-model="activeTab">
    <Tabs>
      <TabPane label="用户会员记录" name="complain">
        <Col span="24">
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
                <div style="display: inline-block;position: absolute;right: 10px;bottom: 10px">
                  <i-button type="success" @click="addition">添加会员</i-button>
                </div>
              </Card>
            </Col>
          </Row>
          <Row style="margin-top:22px;">
            <Col span="24">
              <Card>
                <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
              </Card>
            </Col>
          </Row>
        </Col>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modalalter"
      ok-text="OK"
      title="修改到期时间"
      @on-ok="modification"
    >
      <p style="color: #000000;font-size: 14px;margin: auto">
        修改到期时间：
        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择" @on-change="amend"
                    style="width: 200px"></DatePicker>
      </p>
    </Modal>
    <Modal
      v-model="modaldelete"
      ok-text="OK"
      title="温馨提示"
      @on-ok="eliminate"
    >
      <p>是否确定删除该会员？</p>
    </Modal>
    <Modal
      v-model="modaladd"
      ok-text="OK"
      title="温馨提示"
      @on-ok="addMember"
    >
      <p style="margin-bottom: 12px;color: #000000;font-size: 14px;">是否确定添加该用户为会员？</p>
      <div style="margin-bottom: 14px;color: #000000;">
        会员类型：
        <i-select clearable style="width:200px;" @on-change="getMemberId">
          <i-option v-for="item in MemberType" :value="item.id">{{item.name}}</i-option>
        </i-select>
      </div>
      <p style="color: #000000;">
        到期时间：
        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择" @on-change="getDate"
                    style="width: 200px"></DatePicker>
      </p>
    </Modal>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    search: '',
    name: 'index',
    data() {
      return {
        cancel: true,
        activeTab: 'complain',
        name: '',
        mobile: '',
        photo: '',
        id: '',
        date: '',
        MemberType: [],
        modaldelete: false,
        orgColumns: [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center',
            sortable: true
          },
          {
            title: '会员ID',
            key: 'id',
            align: 'center',
            width: 80,
            editable: true
          },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center',
            width: 80,
            editable: true
          },
          {
            title: 'VIP类型',
            key: 'rank_name',
            // width: 120,
            align: 'center'
          },
          {
            title: 'VIP类型',
            key: 'type',
            // width: 120,
            align: 'center'
          },
          {
            title: '会员价格',
            key: 'price',
            // width: 120,
            align: 'center'
          },
          {
            title: '购买时间',
            key: 'created_at',
            // width: 200,
            align: 'center'
          },
          {
            title: '到期时间',
            key: 'deadline',
            // width: 200,
            align: 'center'
          },
          {
            title: '会员详情',
            key: 'content',
            // width: 200,
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
                    border: 'none'
                  },
                  on: {
                    click: () => {
                      this.modalalter = true
                      this.rank_id = params.row.rank_id
                      this.menberID = params.row.id
                    }
                  }
                }, '会员修改'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px',
                    background: '#d93511',
                    border: 'none'
                  },
                  on: {
                    click: () => {
                      this.modaldelete = true
                      this.menberID = params.row.id
                    }
                  }
                }, '会员删除')
              ])
            }
          }
        ],
        modaladd: false,
        modalalter: false,
        menberID: 0,
        value: '',
        information: [],
        title: '',
        rank_id: '',
        msgBiz: '',
        deadline: '',
        deadline_id: '',
        loading: false,
        brokerLecturerData: []
      }
    },
    methods: {
      getMemberId(rank_id) {
        this.rank_id = rank_id
      },
      getDate(value) {
        this.date = value
      },
      amend(deadline) {
        this.deadline = deadline
      },
      getlist() {
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
                price: item.rank.price + '/月',
                rank_name: item.rank.name + 'VIP',
                created_at: item.created_at,
                content: item.rank.content,
                type: item.rank.type,
                user_id: item.user_id,
                rank_id: item.rank.id
              }
            })
            self.loading = false
          })
        self.loading = true
      },
      eliminate() {//删除VIP
        let self = this
        console.log(self.menberID)
          uAxios.delete('admin/users/rank/histories/' + self.menberID).then((response) => {
            if (response.data.code === 0) {
              this.$Message.info('删除成功');
              this.getlist(this.currentPage)
            } else {
              this.$Modal.error({
                content: response.data.message
              });
            }
          });
      },
      modification() {//修改VIP到期时间
        let self = this,
          data = {
            deadline: self.deadline,
            rank_id: self.rank_id
          }
        uAxios.put('admin/users/rank/histories/' + self.menberID,data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('修改成功');
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            });
          }
        });
      },
      addition() {
        this.modaladd = true
      },
      addMember() {//添加VIP
        let self = this,
          data = {
            deadline: self.date,
            rank_id: self.rank_id
          }
        uAxios.post('admin/users/' + self.id + '/rank/histories', data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('添加成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      genre() {//会员类型
        let self = this
        console.log(self.id)
        uAxios.get('admin/ranks')
          .then(res => {
            let result = res.data.data
            self.MemberType = result.map((item) => {
              return {
                name: item.name,
                id: item.id
              }
            })
            self.loading = false
          })
        self.loading = true
      }
    },
    mounted() {
      this.id = this.$route.params.id
      this.getlist(1)
      this.genre()
      // this.modification()
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
