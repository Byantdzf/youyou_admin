<style lang="less">
  .line-chart-con{
    height: 300px;
  }
  .ivu-tabs-bar{
    margin-bottom: 0;
    margin-top: 15px;
    background: #fff;
  }
  .ivu-tabs-nav{
    padding: 10px 0 10px 0;
    font-weight: bold;
  }
  .ivu-row-flex{
    border-radius: 4px;
    border-top-left-radius: 0;
    margin-left: -4px;
    border: 1px solid #dcdee2;
    border-color: #e8eaec;
  }
  .infor-card-icon-con{
    z-index: 999;
  }
  .ivu-card-bordered{
   border: 0;
  }
</style>
<template>
  <div id="name">
    <!--<Button @click="value1 = true" type="primary">Open</Button>-->
    <!--<Drawer title="Basic Drawer" :closable="false" v-model="value1">-->
      <!--<p>Some contents...</p>-->
      <!--<p>Some contents...</p>-->
      <!--<p>Some contents...</p>-->
    <!--</Drawer>-->
    <Card :bordered="false">
      <div slot="title">
        <span style="font-weight: bold;">选择查询日期：</span>
        <DatePicker type="date" placeholder="Select date" @on-change="changeDate" :value="date" style="width: 200px"></DatePicker>
      </div>
      <div>
        <Row :gutter="5">
          <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="user_created_count"
              :end-val="count.createUser"
              iconType="android-person-add"
              color="#2d8cf0"
              intro-text="今日新增用户"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="collection_count"
              :end-val="count.collection"
              iconType="android-person-add"
              color="#ffd572"
              intro-text="+单身"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="transfer_count"
              :end-val="count.transfer"
              iconType="android-person-add"
              color="#f25e43"
              intro-text="+介绍人"
            ></infor-card>
          </Col>
        </Row>
      </div>
    </Card>
    <Tabs @on-click="getTab">
      <TabPane label="最近七天注册人数" name="0">
        <Row class="margin-top-10">
          <Card>
            <h4 style="text-align: center;margin: 22px;">本周营销总收入：{{income}}</h4>
            <div class="line-chart-con">
              <service-requests :option="option"></service-requests>
            </div>
          </Card>
        </Row>
      </TabPane>
      <TabPane label="周收入报表" name="1" v-if="access === 'admin'">
        <Row class="margin-top-10">
          <Card>
            <h4 style="text-align: center;margin: 22px;">福恋数据</h4>
            <div class="line-chart-con">
              <report-data :columnar="columnar"></report-data>
            </div>
          </Card>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import uAxios from '../../api/index'
import inforCard from './components/inforCard.vue'
import serviceRequests from './components/serviceRequests.vue'
import reportData from './components/reportData.vue'

export default {
  name: 'home',
  components: {
    inforCard,
    serviceRequests,
    reportData
  },
  data () {
    return {
      value1: false,
      count: {
        createUser: 0, // 新增总数
        collection: 0, // 单身
        transfer: 0    // 介绍人
      },
      date: '', // 当前日期
      income: '', // 周总收入
      Data_arr: {}, // XY轴参数
      option: {}, // 折线图参数
      columnar: {},
      Data_newArr: {},
      start_time: [],
      money: '',
      access: localStorage.getItem('access')
    }
  },
  methods: {
    // handleLogin ({ commit }, { userName, password }) {
    //   userName = userName.trim()
    //   return new Promise((resolve, reject) => {
    //     login({
    //       userName,
    //       password
    //     }).then(res => {
    //       const data = res.data.data
    //       commit('setToken', data.access_token)
    //       commit('setAvator', data.photo)
    //       commit('setPaas', data.paas_obj)
    //       commit('setUserName', data.name)
    //       commit('setUserId', data.id)
    //       commit('setAccess', [data.admin_type])
    //       resolve(res.data)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
    },
    changeDate: function (res) {
      this.date = res
      uAxios.get(`admin/daliy/stat?start_time=${this.date}`)
        .then(res => {
          let result = res.data.data
          this.count = {
            createUser: result.courtship_count + result.marriage_count,
            collection: result.courtship_count,
            transfer: result.marriage_count
          }
          console.log(this.count)
        });
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
          };
        });
      uAxios.get('admin/week/stat')
        .then(res => {
          let result = res.data.data
          console.log(result)
          this.Data_arr.xData = result.day_arr
          this.Data_arr.marriage_arr = result.marriage_arr
          this.Data_arr.courtship_arr = result.courtship_arr
          this.income = result.income
          let self = this
          this.option = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['介绍人人数', '单身人数']
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: self.Data_arr.xData
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '介绍人人数',
                type: 'line',
                areaStyle: {
                  normal: {
                    color: '#f25e43'
                  }
                },
                data: self.Data_arr.marriage_arr
              },
              {
                name: '单身人数',
                type: 'line',
                areaStyle: {
                  normal: {
                    color: '#ffd572'
                  }
                },
                data: self.Data_arr.courtship_arr
              }
            ]
          }
        })
    },
    newData () {
      uAxios.get('admin/weeks/stat')
        .then(res => {
          let result = res.data.data
          console.log(result)
          // this.Data_newArr.xDay = result.time_arr.start_time //时间
          this.Data_newArr.xDay = result.time_arr.map((item) => {
            return {
              start_time: item.start_time
            }
          })
          for (let i in this.Data_newArr.xDay) {
            this.start_time.push(this.Data_newArr.xDay[i].start_time)
          }
          this.Data_newArr.activity_cash_arr = result.activity_cash_arr // 活动金额
          this.Data_newArr.pay_orders_cash_arr = result.pay_orders_cash_arr // 订单金额
          this.Data_newArr.award_cash_arr = result.award_cash_arr // 推荐注册金额
          this.Data_newArr.approve_refund_cash_arr = result.approve_refund_cash_arr // 认证退款金额
          let self = this
          this.columnar = {
            tooltip: {
              trigger: 'axis',
            },
            legend: {
              data: ['认证退款金额', '订单金额', '活动金额', '推荐注册金额']
            },
            calculable: true,
            animation: true,
            xAxis: [
              {
                type: 'category',
                data: self.start_time
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '认证退款金额',
                type: 'bar',
                data: self.Data_newArr.approve_refund_cash_arr,
                itemStyle: {
                  emphasis: {color: '#19F0CD'},
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(25,240,205)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: {color: 'black', fontSize: 14}
                    }
                  }
                }
              },
              {
                name: '订单金额',
                type: 'bar',
                data: self.Data_newArr.pay_orders_cash_arr,
                itemStyle: {
                  emphasis: {color: '#2999B7'},
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(41,153,183)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: {color: 'black', fontSize: 14}
                    }
                  }
                }
              },
              {
                name: '活动金额',
                type: 'bar',
                data: self.Data_newArr.activity_cash_arr,
                itemStyle: {
                  emphasis: {color: '#F27844'},
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(242,120,68)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: {color: 'black', fontSize: 14}
                    }
                  }
                }
              },
              {
                name: '推荐注册金额',
                type: 'bar',
                data: self.Data_newArr.award_cash_arr,
                itemStyle: {
                  emphasis: {color: '#909090'},
                  normal: {
                    color: function (params) {
                      var colorList = ['rgb(114,114,114)']
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      textstyle: {color: 'black', fontSize: 14}
                    }
                  }
                }
              }
            ]
          }
        })
    }
  },
  mounted () {
    var myDate = new Date()
    this.date = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`
    this.getData()
    this.newData()
  }
}
</script>
