<template>
  <div v-model="activeTab">
    <Tabs @on-click="getTab">
      <TabPane label='用户' name="user">
        <Input
          v-model="searchKeyword"
          @on-enter="createLabel"
          placeholder="搜索用户..."
          style="width: 200px; margin-bottom: 22px;"/>
        <span @click="createLabel">
          <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
        </span>
        <Card style="margin-bottom: 32px">
          <div slot="title">
            <Icon type="ionic"></Icon>
            点击标签筛选
            <!--<span style="background-image: linear-gradient(to right, #c8241b, #fc6906);box-shadow:1px 1px 12px #fc9185;padding:2px 7px;color: white;text-align: center;border-radius: 32px;margin-right: 12px;">{{total}}人</span>-->
          </div>
          <RadioGroup v-model="social" v-for="(item,index) in labels" :key="index" @on-change="filterLabel"
                      style="margin-bottom: 12px;display: inline-block">
            <Radio :label="index">
              <span>{{item}}</span>
            </Radio>
          </RadioGroup>
        </Card>
        <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
      </TabPane>
      <TabPane label='渠道' name="org">
        <Input
          v-model="searchKeyword"
          @on-enter="createLabel"
          placeholder="搜索用户..."
          style="width: 200px; margin-bottom: 22px;"/>
        <span @click="createLabel">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
        <Card style="margin-bottom: 32px">
          <div slot="title">
            <Icon type="ionic"></Icon>
            点击标签筛选
          </div>
          <RadioGroup v-model="social" v-for="(item,index) in labels" :key="index" @on-change="filterLabel"
                      style="margin-bottom: 12px;display: inline-block">
            <Radio :label="index">
              <span>{{item}}</span>
            </Radio>
          </RadioGroup>
        </Card>
        <Table :loading="loading" :columns="Columns1" :data="information" style="width: 100%;" border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="OK"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否确认删除该用户？</p>
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import uAxios from '../../api/index'
  import config from '../../api/config'

  // import moment from 'moment';

  export default {
    search: '',
    name: 'recommend',
    data () {
      return {
        activeTab: 'user',
        currentPage: 1,
        searchKeyword: '',
        modal: false, // 弹
        // 框
        orgTotal: 0,
        id: '',
        social: 0,
        total: '',
        count: [],
        jump: {
          is_vip: 0,
          is_match: 0,
          has_maker: 0,
          is_approved: 0,
          type: 'all',
          sex: 0
        },
        labels: ['当天', '本周', '本月', '全部'],
        Columns: [
//
          {
            title: 'ID',
            align: 'center',
            key: 'id',
            width: 80
          },
          {
            title: 'uid',
            align: 'center',
            key: 'uid'
          },
          {
            title: 'openid',
            align: 'center',
            key: 'openid',
            width: 260
          },
          {
            title: 'userid',
            align: 'center',
            key: 'user_id'
          },
          {
            title: '头像',
            key: 'updatedAt',
            width: 80,
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
            title: '名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'mobile',
            width: 150
          },
          {
            title: '性别',
            align: 'center',
            key: 'sex'
          },
          {
            title: '推荐人数',
            align: 'center',
            key: 'invite_count'
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {id: params.row.user_id}
                      const {href} = this.$router.resolve({
                        name: 'user_detail',
                        params: argu
                      })
                      window.open(href, '_blank')
                    }
                  }
                }, '用户详情'),
//                                h('Button', {
//                                    props: {
//                                        type: 'warning',
//                                    },
//                                    style: {
//                                        margin: '5px'
//                                    },
//                                    on: {
//                                        click: () => {
////                                            this.modal = true;
//                                            this.id = params.row.id;
//
//                                            let argu = {id: params.row.id};
//                                            const { href } = this.$router.resolve({
//                                                name: 'user_recommend',
//                                                params: argu
//                                            });
//                                            window.open(href, '_blank');
//                                        }
//                                    }
//                                }, '推荐列表')
              ])
            }
          }
        ],
        Columns1: [
          {
            title: 'ID',
            align: 'center',
            key: 'id',
            width: 80
          },
          {
            title: '来源平台',
            align: 'center',
            key: 'app_id',
          },
          {
            title: '推荐人数',
            align: 'center',
            key: 'invite_count'
          }
        ],
        value: '',
        information: [],
        loading: false,
        type: 'day'
      }
    },
    watch: {},
    methods: {
      createLabel () {
        console.log(this.searchKeyword)
        this.page = 1
        this.getlist(1)
      },
      complainList () {
        // 投诉列表
        this.$router.push({
          name: 'complain'
        })
      },
      filterLabel () {
        switch (this.social) {
          case 0:
            this.type = 'day'
            break
          case 1:
            this.type = 'week'
            break
          case 2:
            this.type = 'month'
            break
          default:
            this.type = ''
        }
        console.log(this.type)
        this.page = 1
        this.getlist(1)
      },
      deleteUser () {
        let self = this
        uAxios.delete('admin/users/' + self.id).then((response) => {
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
      handlePage (num) {
        // 分页
        this.currentPage = num
        this.getlist(num)
      },
      // 用户数据
      getlist (page) {
        let self = this
        self.loading = true
        if (this.activeTab == 'user') {
          uAxios.get(`admin/users/from/users?page=${page}&keyword=${self.searchKeyword}&type=${self.type}`)
            .then(res => {
              let result = res.data.data
              self.total = res.data.data.total
              self.information = result.data.map((item) => {
                return {
                  avatar: item.circle_avatar,
                  created_at: item.created_at,
                  user_id: item.user_id,
                  openid: item.openid,
                  id: item.id,
                  mobile: item.mobile,
                  name: item.name,
                  invite_count: item.invite_count,
                  sex: item.sex == 1 ? '男' : '女'
                }
              })
              self.orgTotal = result.total
              self.loading = false
            })
        } else {
          uAxios.get(`admin/users/from/platforms?page=${page}&keyword=${self.searchKeyword}&type=${self.type}`)
            .then(res => {
              let result = res.data.data
              self.total = res.data.data.total
              self.information = result.data
              self.orgTotal = result.total
              self.loading = false
            })
        }
      },
      handleSearch () {
        let query = '&keyword=' + this.searchKeyword
        let self = this
        let page = 1
        uAxios.get('posts?page=' + page + query)
          .then(res => {
            let result = res.data.data
            self.orgData = result.data
            console.log(self.orgData)
            self.orgTotal = result.total
            // self.searchKeyword = ''
          })
      }
    },
    mounted () {
      // if (Cookies.get('admin_type') === 'matcher') {
      //     return this.$router.push({
      //         name: 'error-403',
      //         params: ''
      //     });
      // }
      this.getlist(1)
      // this.$store.commit('updateMenulist');
    }
  }
</script>

<style lang="less">
  /*@import "../../styles/common";*/
</style>
