<style lang="less" scoped>
  .line-chart-con {
    height: 300px;
  }

  .ivu-card-body {
    text-align: center;
  }

  ._bc-list {
    box-shadow: 0 0 12px #d3d3d3;
    margin-bottom: 12px;
    padding: 12px;
    position: relative;
  }

  ._bc-num {
    font-size: 42px;
    font-weight: bold;
    position: absolute;
    right: 6%;
    top: 40%;
  }

  .bc-style {
    width: 54px;
    position: absolute;
    right: 2%;
    top: 2%;
  }

  .float_l {
    float: left;
  }

  ._bc-name {
    font-size: 16px;
    margin-left: 12px;
    font-weight: bold;
  }

  .bc_detail {
    p {
      margin-bottom: 12px;
    }

    font-size: 18px;
    text-align: left;
  }
</style>
<template>
  <div id="name">
    <div v-model="activeTab">
      <Tabs @on-click="getTab">
        <TabPane label="活动签到" name="signIn">
          <Card :bordered="false">
            <Row :gutter="5">
              <Col :xs="24" :sm="12" :md="6" offset="3" :style="{marginBottom: '10px'}">
                <infor-card
                  id-name="user_created_count"
                  :end-val="count.createUser"
                  iconType="android-person-add"
                  color="#2d8cf0"
                  intro-text="签到总人数"
                ></infor-card>
              </Col>
              <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <infor-card
                  id-name="collection_count"
                  :end-val="count.collection"
                  iconType="android-person-add"
                  color="#ffd572"
                  intro-text="弟兄"
                  style="margin: 0 22px"
                ></infor-card>
              </Col>
              <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <infor-card
                  id-name="transfer_count"
                  :end-val="count.transfer"
                  iconType="android-person-add"
                  color="#f25e43"
                  intro-text="姐妹"
                ></infor-card>
              </Col>
            </Row>
          </Card>
          <Row style="margin-top: 20px">
            <h4 style="text-align: center;margin: 22px;"></h4>
            <div style="margin-bottom: 100px">
              <Col span="10">
                <Card>
                  <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    活动详情
                  </p>
                  <div class="bc_detail">
                    <p>活动名称：{{information.theme}}</p>
                    <p>举办方：{{information.host}}</p>
                    <p>报名费用：{{information.fee}}元</p>
                    <p>开始时间：{{information.start_time}}</p>
                    <p>结束时间：{{information.end_time}}</p>
                    <p>地址：{{information.address}}</p>
                  </div>
                </Card>
              </Col>
              <Col span="13" offset="1">
                <Card style="text-align: center">
                  <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    活动签到
                  </p>
                  <img :src="information.sign_in_qrcode" alt="" width="500px" height="500px" style="margin-top: 12px">
                </Card>
              </Col>
            </div>
          </Row>
        </TabPane>
        <TabPane label="评选活动" name="signIn1">
          <Row style="margin-top: 20px">
            <Col span="24" style="margin-bottom: 22px;">
              <Card style="text-align: center">
                <p slot="title" class="card-title">
                  扫码选出你心仪的对象
                </p>
                <!--<img src="http://images.ufutx.com/201812/26/1283cd2a3e9dacfef2ce60fe7805accd.png" alt="" width="200" style="position:absolute;bottom: 0;right: 0">-->
                <img :src="LuckMember.qrcode" alt="" max-width="800px">
              </Card>
            </Col>
            <Col span="24" style="margin-top: 22px; margin-bottom: 44px;" v-if="matches.length > 0">
              <Card>
                <p slot="title" class="card-title"><span class="float_l">最佳匹配</span></p>
                <div v-for="item,index in matches" class="_bc-list">
                  <img :src="item.user.circle_avatar" alt="" width="120px" height="120px">
                  <span class="_bc-name">{{item.user.name}}</span>
                  <img src="http://images.ufutx.com/201812/26/459558ae48ecb17fdc143acd2b82b5cf.png" alt="" height="60px"
                       style="margin: 22px; margin-bottom: 22px;">
                  <span class="_bc-name">{{item.other_user.name}}</span>
                  <img :src="item.other_user.circle_avatar" alt="" width="120px" height="120px">
                  <img v-if="index == 0" src="http://images.ufutx.com/201812/26/21919d6a6b122a9185b638ce67d9250a.png"
                       class="bc-style"/>
                  <img v-if="index == 1" src="http://images.ufutx.com/201812/26/336e0ac44ed7d1946f00f4195e5646d3.png"
                       class="bc-style"/>
                  <img v-if="index == 2" src="http://images.ufutx.com/201812/26/ca99eaab4a2b5247d0d5f93b1e86ff22.png"
                       class="bc-style"/>
                  <div style="clear: both;"></div>
                </div>
              </Card>
            </Col>
            <Col span="10" v-if="welcome_male_users.length > 0">
              <Card>
                <p slot="title" class="card-title">
                  <span class="float_l">最佳欢迎</span><img
                  src="http://images.ufutx.com/201812/26/e3bda271deea123ba59ae3c5dc2d6657.png" width="22"
                  class="float_l" alt="男">
                </p>
                <div v-for="item,index in welcome_male_users" class="_bc-list">
                  <img :src="item.circle_avatar" alt="" width="120px" height="120px" class="float_l">
                  <span class="float_l _bc-name">{{item.name}}</span>
                  <img src="http://images.ufutx.com/201812/26/e3bda271deea123ba59ae3c5dc2d6657.png" width="24"
                       class="float_l" v-if="item.sex == 1" alt="男">
                  <img src="http://images.ufutx.com/201812/26/1b8e3141b47f84969b19e931b070e478.png" v-else alt="女"
                       class="float_l" width="24">
                  <span class="_bc-num" :style="{color: item.color}">{{item.vote_count}}</span>
                  <img v-if="index == 0" src="http://images.ufutx.com/201812/26/21919d6a6b122a9185b638ce67d9250a.png"
                       class="bc-style"/>
                  <img v-if="index == 1" src="http://images.ufutx.com/201812/26/336e0ac44ed7d1946f00f4195e5646d3.png"
                       class="bc-style"/>
                  <img v-if="index == 2" src="http://images.ufutx.com/201812/26/ca99eaab4a2b5247d0d5f93b1e86ff22.png"
                       class="bc-style"/>
                  <div style="clear: both;"></div>
                </div>
              </Card>
            </Col>
            <Col span="10" offset="4" v-if="welcome_female_users.length > 0">
              <Card>
                <p slot="title" class="card-title">
                  <span class="float_l">最佳欢迎</span><img
                  src="http://images.ufutx.com/201812/26/1b8e3141b47f84969b19e931b070e478.png" width="22"
                  class="float_l" alt="男">
                </p>
                <div v-for="item,index in welcome_female_users" class="_bc-list">
                  <img :src="item.circle_avatar" alt="" width="120px" height="120px" class="float_l">
                  <span class="float_l _bc-name">{{item.name}}</span>
                  <img src="http://images.ufutx.com/201812/26/e3bda271deea123ba59ae3c5dc2d6657.png" width="24"
                       class="float_l" v-if="item.sex == 1" alt="男">
                  <img src="http://images.ufutx.com/201812/26/1b8e3141b47f84969b19e931b070e478.png" v-else alt="女"
                       class="float_l" width="24">
                  <span class="_bc-num box" :style="{color: item.color}">{{item.vote_count}}</span>
                  <img v-if="index == 0" src="http://images.ufutx.com/201812/26/21919d6a6b122a9185b638ce67d9250a.png"
                       class="bc-style"/>
                  <img v-if="index == 1" src="http://images.ufutx.com/201812/26/336e0ac44ed7d1946f00f4195e5646d3.png"
                       class="bc-style"/>
                  <img v-if="index == 2" src="http://images.ufutx.com/201812/26/ca99eaab4a2b5247d0d5f93b1e86ff22.png"
                       class="bc-style"/>
                  <div style="clear: both;"></div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="人员介绍" name="search">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                        <Button type="primary" icon="search" style=" margin-bottom: 22px;">搜索</Button>
                    </span>
          <Card>
            <p slot="title" style="color: #ff6c4c">报名信息</p>
            <Table :columns="Columns" :data="list" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import inforCard from './components/inforCard.vue'
  import countUp from './components/countUp.vue'

  export default {
    name: 'activity',
    components: {
      inforCard,
      countUp
    },
    data () {
      return {
        id: 0,
        activeTab: 'signIn',
        orgTotal: 0,
        timer: '',
        total: 0,
        count: {
          createUser: 0, // 新增总数
          collection: 0, // 单身
          transfer: 0    // 介绍人
        },
        date: '', // 当前日期
        income: '', // 周总收入
        Data_arr: {}, // XY轴参数
        searchKeyword: '',
        loading: false,
        Columns: [
          {
            title: 'ID',
            align: 'center',
            width: 100,
            key: 'id'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'mobile'
          },
          {
            title: '头像',
            key: 'updatedAt',
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
                    let argu = {user_detail_id: params.row.id}
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
            title: '性别',
            align: 'center',
            width: 100,
            key: 'sex'
          },
          {
            title: '加入时间',
            align: 'center',
            key: 'created_at'
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {member_detail_id: params.row.user_id}
                      this.$router.push({
                        name: 'member_detail',
                        params: argu
                      })
                    }
                  }
                }, '用户详情')
              ])
            }
          }
        ],
        information: [],
        information1: [],
        LuckMember: [],
        welcome_male_users: [],
        welcome_female_users: [],
        matches: [],
        list: []
        //
      }
    },
    methods: {
      handlePage (num) {
        this.currentPage = num
        this.getlist(num)
      },
      handleSearch () {
        this.getlist(1)
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        if (type == 'signIn1') {
          this.timer = setInterval(() => {
            this.getlist(1)
            this.getLuckMember()
          }, 5000)
        } else {
          clearTimeout(this.timer)
        }
      },
      getlist (page) {
        let self = this,
          jump = ''
        self.loading = true
        uAxios.get(`admin/activities/${self.id}?page=${page}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data
            self.information = result.data
            self.list = self.information.member.data
            for (let item of self.list) {
              item.sex = item.sex == 1 ? '男' : '女'
            }
            self.count.createUser = self.information.male_sign_in_count + self.information.female_sign_in_count
            self.count.collection = self.information.male_sign_in_count
            self.count.transfer = self.information.female_sign_in_count
            console.log(result.data)
            self.orgTotal = result.data.member.total
            self.loading = false
          })
      },
      getLuckMember (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/activities/${self.id}/welcome`)
          .then(res => {
            let result = res.data
            self.LuckMember = result.data
            self.welcome_male_users = result.data.welcome_male_users
            self.welcome_female_users = result.data.welcome_female_users
            self.matches = result.data.matches
            console.log(result.data)
          })
      },
      getData () {
        let self = this
        uAxios.get(`admin/daliy/stat?start_time=${this.date}`)
          .then(res => {
            let result = res.data.data
            this.count = {
              createUser: result.courtship_count + result.marriage_count,
              collection: result.courtship_count,
              transfer: result.marriage_count
            }
          })
        uAxios.get('admin/week/stat')
          .then(res => {
            let result = res.data.data
            this.Data_arr.xData = result.day_arr
            this.Data_arr.marriage_arr = result.marriage_arr
            this.Data_arr.courtship_arr = result.courtship_arr
            this.income = result.income
          })
      }
    },
    mounted () {
//            var myDate = new Date();
//            this.date = `${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`
      this.id = this.$route.params.activity_detail_id
      this.getlist(1)
      this.getLuckMember()
    },
    beforeDestroy () {
      clearTimeout(this.timer)
    }
  }
</script>
