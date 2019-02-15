<template>
  <div v-model="activeTab">
    <Card icon="ios-people" title="用户推荐" :bordered="false">
      <div style="margin: 22px">
        <Row>
          <Col span="11">
            <span> 选择用户：</span>
            <Select v-model="referresID" style="width: 300px;"  filterable @on-query-change="getGropData">
              <Option v-for="item in userList" :value="item.id" :key="item.id" >{{ item.name }}</Option>
            </Select>
            <Button type="success" style="margin-left: 12px;" @click="setReferres">设置为推荐人</Button>
          </Col>
        </Row>
      </div>
      <!--<div style="margin: 22px">-->
        <!--<Row>-->
          <!--<span>充值金额：</span>-->
          <!--<Input  placeholder="请输入充值金额"  v-model="money" style="width: 300px" ></Input>-->
          <!--<Button type="success" style="margin-left: 12px;" @click="pay_user">确认充值</Button>-->
        <!--</Row>-->
      <!--</div>-->
    </Card>
    <Tabs @on-click="getTab" style="margin-top: 12px;">
      <TabPane label="推荐人列表"  name="score">
        <Col span="24">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch" >
                    <Button type="primary" icon="search" style=" margin-bottom: 22px;">搜索</Button>
                </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </Col>
      </TabPane>
    </Tabs>
    <!--<Modal-->
    <!--v-model="modal1"-->
    <!--title="温馨提示"-->
    <!--@on-ok="ok"-->
    <!--&gt;-->
    <!--<p>是否确定删除该公众号？</p>-->
    <!--</Modal>-->
    <!--<Modal-->
    <!--v-model="modal"-->
    <!--title="编辑公众号"-->
    <!--@on-ok="cancel"-->
    <!--&gt;-->
    <!--<Input v-model="value" placeholder="Enter something..." style="width: 300px"></Input>-->
    <!--</Modal>-->
  </div>
</template>

<script>
import uAxios from '../../api/index'
import config from '../../api/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  search: '',
  name: 'index',
  components: {
    dropdown: dropdown
  },
  data () {
    return {
      activeTab: 'score',
      userSearch: '', // 用户搜索
      searchKeyword: '', // 搜索
      orgTotal: 0, // 分页
      userList: [], // 用户列表
      referresID: '', // 充值用户
      id: '',
      money: 0, // 充值金额
      orgColumns: [
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: 'UserID',
          key: 'user_id',
          align: 'center',
          width: 100,
          editable: true
        },
        {
          title: '用户名',
          key: 'name',
          align: 'center',
          //                        width: 100,
          editable: true
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
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                marginTop: '6px',
                border: '4px solid #f4f4f4'
              },
              on: {
                click: () => {
                  let argu = { user_detail_id: params.row.user_id }
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
          title: '推荐总人数',
          key: 'num',
          align: 'center',
          editable: true
        },
        {
          title: '推荐总金额',
          key: 'amount',
          align: 'center',
          editable: true
        },
        {
          title: '成为推荐人时间',
          key: 'created_at',
          align: 'center',
          editable: true
        },
        {
           title: '操作',
           key: 'user_id',
           align: 'center',
           render: (h, params) => {
               return h('div', [
                   h('Button', {
                       props: {
                           type: 'primary',
                       },
                       on: {
                           click: () => {
                               console.log(params.row.id)
                               let argu = {record_id: params.row.user_id};
                               this.$router.push({
                                   name: 'record',
                                   params: argu
                               });
                           }
                       }
                   }, '查看推荐用户收益记录')
               ]);
           }
        }
      ],
      modal: false,
      information: [],
      title: '',
      loading: false
    }
  },
  methods: {
    setReferres () {
      // 设置为推荐人
      console.log(this.referresID)
      if (!this.referresID) { return this.$Message.error('请选择要设置为推荐人的用户！') }
      // let reg = /^[0-9]*$/
      // if (!reg.test(this.money)) {
      //   return this.$Message.error('请输入正确的充值金额！')
      // }
      uAxios.post(`admin/referres/users/${this.referresID}`)
        .then(res => {
          let result = res.data
          if (result.code == 0) {
            this.$Message.success('设置成功！')
            this.getlist()
          }
        })
    },
    getGropData (value) {
      let self = this
      self.loading = true
      uAxios.get(`admin/users?keyword=${value}`)
        .then(res => {
          let result = res.data.data.data
          this.userList = result.map((item) => {
            return {
              name: item.name,
              id: item.id
            }
          })
        })
    },
    getTab (type) {
      this.activeTab = type
      this.getlist(1)
    },
    handlePage (num) {
      // 分页
      this.getlist(num)
    },
    getlist (page) {
      let self = this
      self.loading = true
      uAxios.get(`admin/referres?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result != null) {
            self.information = result.data
            self.orgTotal = result.total
            self.loading = false
            // self.searchKeyword = ''
          }
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    if (Cookies.get('admin_type') === 'matcher') {
      return this.$router.push({
        name: 'error-403',
        params: ''
      })
    }
    this.getlist(1)
    // this.$Modal.info({
    //     title: '请稍等...',
    //     content: '本页数据较多，请等待大约5秒，加载成功后，本框会自动消失 !!! 数据加载中...',
    //     okText: '请求数据中...',
    //     loading: true
    // });
    // setTimeout(() => {
    //   this.$Modal.remove()
    // }, 5000)
  }
}
</script>

<style lang="less">
</style>
