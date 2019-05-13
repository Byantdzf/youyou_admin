<template>
  <div v-model="activeTab">
    <Card>
      <div style="width: 22%;display: inline-block">
        <span>推荐人头像：<img v-bind:src="user.circle_avatar" alt="" width="80rpx"></span>
      </div>
      <div style="width: 22%;display: inline-block">
        <div>推荐人：<span style="font-weight: bold;">{{user.name}}</span></div>
        <div>推荐人userID：<span style="font-weight: bold;">{{user.id}}</span></div>
      </div>
    </Card>
    <Tabs @on-click="getTab" style="margin-top: 12px;">
      <TabPane label="收益记录"  name="score">
        <Col span="24">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch" >
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;">搜索</Button>
                </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </Col>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import uAxios from '../../api'
import config from '../../api/config'
import dropdown from '../components/dropdown'
import Cookies from 'js-cookie'

export default {
  search: '',
  name: 'record',
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
      id: '',
      money: 0, // 充值金额
      orgColumns: [
        {
          title: 'ID',
          key: 'id',
          width: 80,
          align: 'other_id',
          editable: true
        },
        {
          title: 'userID',
          key: 'other_id',
          align: 'center',
          editable: true
        },
        {
          title: '用户名',
          key: 'other_user_name',
          align: 'center',
          editable: true
        },
        {
          title: '头像',
          key: 'avatar',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.other_user_circle_avatar
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
                  let argu = { id: params.row.id }
                }
              }
            })
          },
          width: 80,
          align: 'center'
        },
        {
          title: '订单号',
          key: 'trade_no',
          align: 'center',
          editable: true
        },
        {
          title: '收益类型',
          key: 'type',
          align: 'center',
          editable: true
        },
        {
          title: '收益金额',
          key: 'amount',
          align: 'center',
          editable: true
        },
        {
          title: '收益时间',
          key: 'created_at',
          align: 'center',
          editable: true
        }
      ],
      modal: false,
      information: [],
      title: '',
      loading: false,
      user: {
        circle_avatar: '',
        name: '',
        id: 0
      }
    }
  },
  methods: {
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
      uAxios.get(`admin/users/${self.id}/referre/award/histories?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.information = result.data
            for(let item of self.information){
              item.type = item.type === 'approve'? '实名认证收益': '注册收益';
            }
            self.user = {
              circle_avatar: self.information[0].circle_avatar,
              name: self.information[0].name,
              id: self.information[0].id
            }
            self.orgTotal = result.total
            // self.searchKeyword = ''
          }
          self.loading = false
        })
    },
    handleSearch () {
      this.getlist(1)
    }
  },
  mounted () {
    this.id = this.$route.params.id;
    this.getlist(1)
  }
}
</script>

<style lang="less">
</style>
