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
      <i-input style="width: 340px" type="textarea" :rows="3" placeholder="请输入..." v-model="content"></i-input>
    </Modal>
    <Modal
      v-model="modal2"
      title="温馨提示"
      :ok-text="text"
      @on-ok="deleteUser"
      no-cancel>
      <div style="font-size: 14px">
        是否确定删除该推荐？
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
  data() {
    return {
      activeTab: '0',
      currentPage: 1,
      searchKeyword: '',
      orgTotal: 0,
      modal2: false,
      type: '',
      id: '',
      modal1: false,
      text: '确认',
      content: '',
      orgColumns: [
        {
          title: 'ID',
          align: 'center',
          width: 100,
          key: 'recommend_id'
        },
        {
          title: '用户ID',
          align: 'center',
          width: 120,
          key: 'user_id'
        },
        {
          title: '名称',
          key: 'user_name',
          align: 'center'
        },
        {
          title: '头像',
          key: 'photo',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.photo
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
          title: '性别',
          key: 'sex',
          align: 'center'
        },
        {
          title: '单身/介绍人',
          key: 'type',
          align: 'center'
        },
        {
          title: '申请时间',
          key: 'created_at',
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
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.status = '1'
                      this.recommend_id = params.row.recommend_id
                      this.cancel()
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
                      this.modal = true
                      this.status = '-1'
                      this.recommend_id = params.row.recommend_id
                    }
                  }
                }, '拒绝申请')
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
                      this.modal2 = true
                      this.recommend_id = params.row.recommend_id
                    }
                  }
                }, '删除推荐')
              ])
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
      loading: false,
    }
  },
  methods: {
    showModel (item) {
      this.modal1 = true
      this.image = item
    },
    cancel () {
      this.modal = false
      let self = this,
        data = {
          recommend_id: this.recommend_id,
          status: this.status,
          content: this.content
        }
      uAxios.put(`admin/check/home/recommends/` + self.recommend_id, data)
        .then(res => {
          if (res.data.code === 0) this.$Message.info('已处理')
          this.information.splice(this.feedbackIndex, 1)
        })
    },
    deleteUser () {
      let self = this
      uAxios.delete('admin/home/recommends/' + self.recommend_id).then((response) => {
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
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
      this.getlist(1)
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`admin/home/recommends/v2?page=${page}&status=${self.activeTab}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          console.log(result)
          self.orgTotal = result.total
          self.loading = false
          self.information = result.data.map((item) => {
            return {
              created_at: item.created_at,
              recommend_id: item.id,
              photo: item.user.photo,
              user_id: item.user.id,
              mobile: item.user.mobile,
              user_name: item.user.name,
              sex: item.user.sex == 1 ? '男' : '女',
              type: item.user.type == 'single' ? '单身' : '介绍人',
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
</style>
