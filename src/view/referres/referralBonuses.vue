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
      title="温馨提示"
      :ok-text="text"
      @on-ok="cancel"
    >
      <p style="font-size: 14px;font-weight: bold;margin-bottom: 4px">拒绝理由：</p>
      <i-input style="width: 340px" type="textarea" :rows="3" placeholder="请输入..." v-model="contentText"></i-input>
    </Modal>
    <!--<Modal-->
      <!--v-model="modal2"-->
      <!--title="温馨提示"-->
      <!--:ok-text="text"-->
      <!--@on-ok="deleteUser"-->
      <!--no-cancel>-->
      <!--<div style="font-size: 14px">-->
        <!--是否确定删除该推荐？-->
      <!--</div>-->
    <!--</Modal>-->
  </div>
</template>

<script>
import uAxios from '../../api'
import config from '../../api/config'

export default {
  search: '',
  name: 'referralBonuses',
  data () {
    return {
      activeTab: '0',
      currentPage: 1,
      searchKeyword: '',
      orgTotal: 0,
      modal2: false,
      type: '',
      id: '',
      user_id: '',
      modal1: false,
      text: '确认',
      contentText: '',
      orgColumns: [
        {
          title: '用户ID',
          align: 'center',
          width: 120,
          key: 'user_id'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '头像',
          key: 'circle_avatar',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.circle_avatar
              },
              style: {
                width: '42px',
                height: '42px',
                marginTop: '6px'
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
          title: '手机号',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '实名认证',
          key: 'is_approved',
          align: 'center'
        },
        {
          title: '单身/介绍人',
          key: 'type',
          align: 'center'
        },
        {
          title: '第一周分享人数',
          key: 'first_week_count',
          align: 'center'
        },
        {
          title: '其他周分享人数',
          key: 'other_week_count',
          align: 'center'
        },
        {
          title: '总分享人数',
          key: 'bonus_count',
          align: 'center'
        },
        {
          title: '奖励金额',
          key: 'award',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            if (this.activeTab == '0') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  style: {
                    margin: '3px'
                  },
                  on: {
                    click: () => {
                      this.status = '1'
                      this.user_id = params.row.user_id
                      this.cancel()
                    }
                  }
                }, '同意申请'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  style: {
                    margin: '3px'
                  },
                  on: {
                    click: () => {
                      this.modal = true
                      this.status = '-1'
                      this.user_id = params.row.user_id
                      console.log(params.row, '9999')
                    }
                  }
                }, '拒绝申请'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '3px'
                  },
                  on: {
                    click: () => {
                      this.showPhoto(params.row.circle_avatar)
                    }
                  }
                }, '查看头像')
              ])
            } else {
              // return h('div', [
              //   h('Button', {
              //     props: {
              //       type: 'error'
              //     },
              //     style: {
              //       margin: '5px'
              //     },
              //     on: {
              //       click: () => {
              //         this.modal2 = true
              //         this.user_id = params.row.user_id
              //       }
              //     }
              //   }, '删除推荐')
              // ])
            }
          }
        }
      ],
      status: '',
      modal: false,
      value: '',
      recommend_id: '',
      image: '',
      information: [],
      title: '',
      loading: false
    }
  },
  methods: {
    showPhoto (photo) {
      this.$Modal.success({
        title: `查看头像`,
        content: `<img src="${photo}" width="100%"/>`
      })
    },
    showModel (item) {
      this.modal1 = true
      this.image = item
    },
    cancel () {
      this.modal = false
      let self = this,
        data = {
          user_id: this.user_id,
          status: this.status,
          contentText: this.contentText
        }
      uAxios.post(`admin/deal/added/bonus/users/` + self.user_id, data)
        .then(res => {
          if (res.data.code === 0) this.$Message.info('已处理')
          this.information.splice(this.feedbackIndex, 1)
        })
      console.log(data, '96969')
    },
    // deleteUser () {
    //   let self = this
    //   uAxios.delete('admin/home/recommends/' + self.recommend_id).then((response) => {
    //     if (response.data.code === 0) {
    //       this.$Message.info('删除成功')
    //       this.getlist(this.currentPage)
    //     } else {
    //       this.$Modal.error({
    //         content: response.data.message
    //       })
    //     }
    //   })
    // },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
      this.getlist(1)
    },
    getlist (page) {
      let self = this,
        data = {
          user_id: this.user_id,
          status: this.status,
          contentText: this.contentText
        }
      uAxios.get(`admin/referre/added/bonus`, data)
        .then(res => {
          let result = res.data.data
          console.log(result, '9595')
          self.orgTotal = result.total
          self.loading = false
          self.information = result.data.map((item) => {
            return {
              name: item.name,
              circle_avatar: item.circle_avatar,
              first_week_count: item.first_week_count,
              other_week_count: item.other_week_count,
              bonus_count: item.bonus_count,
              award: item.award,
              user_id: item.id,
              wechat_id: item.wechat.id,
              mobile: item.mobile,
              created_at: item.wechat.created_at,
              gender: item.wechat.gender == '1' ? '男' : '女  ',
              type: item.type == 'marriage' ? '介绍人' : '单身',
              is_approved: item.is_approved == '1' ? '已认证' : '未认证'
            }
          })
        })
    },
    handlePage (num) {
      // 分页
      this.currentPage = num
      this.getlist(num)
    },
    handleSearch () {
      this.getlist(1)
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
  .ivu-modal-confirm-body{
    padding: 0;
  }
</style>
