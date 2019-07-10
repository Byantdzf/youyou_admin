<template>
  <div id="name">
    <Card :bordered="false" title="用户数据">
      <div>
        <Row :gutter="5">
          <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px',marginRight: '16px'}">
            <infor-card
              id-name="user_created_count"
              :end-val="allUser"
              iconType="android-person-add"
              color="#2D8cF0"
              intro-text="全部用户"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="collection_count"
              :end-val="dayUser"
              iconType="android-person-add"
              color="#ffd572"
              intro-text="今日新增用户"
            ></infor-card>
          </Col>
        </Row>
      </div>
    </Card>
    <Card style="margin-top: 22px;">
      <Tabs @on-click="getTab">
        <TabPane label="最近七天新增人数" name="0">
          <Row class="margin-top-10">
            <!--<h4 style="text-align: center;margin: 22px;">本周营销总收入：{{income}}</h4>-->
            <div class="line-chart-con">
              <service-requests :option="option"></service-requests>
            </div>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
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
        createUser: 0 // 新增总数
      },
      date: '', // 当前日期
      Data_arr: {}, // XY轴参数
      option: {},
      columnar: {},
      Data_newArr: {},
      allUser: 0,
      dayUser: 0,
      start_time: [],
      money: '',
    }
  },
  methods: {
    getTab (type) { // 获得激活的Tab页
      this.activeTab = type
    },
    getData () {
      let self = this
      uAxios.get(`admin/new/user/num?start_time=${this.date}`)
        .then(res => {
          let result = res.data.data
          this.allUser = result.all_num
          this.dayUser = result.today_num
          this.Data_arr.xData = result.day_arr
          this.Data_arr.user_num_arr = result.user_num_arr
          let self = this
          self.option = {
            color: ['#3398DB'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                data : self.Data_arr.xData,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                name:'今日新增人数',
                type:'bar',
                barWidth: '60%',
                data: self.Data_arr.user_num_arr
              }
            ]
          }
          // this.option = {
          //   tooltip: {
          //     trigger: 'axis'
          //   },
          //   legend: {
          //     data: ['介绍人人数', '单身人数']
          //   },
          //   tooltip: {
          //     trigger: 'axis',
          //     axisPointer: {
          //       type: 'cross',
          //       label: {
          //         backgroundColor: '#6a7985'
          //       }
          //     }
          //   },
          //   xAxis: [
          //     {
          //       type: 'category',
          //       boundaryGap: false,
          //       data: self.Data_arr.xData
          //     }
          //   ],
          //   yAxis: [
          //     {
          //       type: 'value'
          //     }
          //   ],
          //   series: [
          //     {
          //       name: '介绍人人数',
          //       type: 'line',
          //       areaStyle: {
          //         normal: {
          //           color: '#f25e43'
          //         }
          //       },
          //       data: self.Data_arr.marriage_arr
          //     },
          //     {
          //       name: '单身人数',
          //       type: 'line',
          //       areaStyle: {
          //         normal: {
          //           color: '#ffd572'
          //         }
          //       },
          //       data: self.Data_arr.courtship_arr
          //     }
          //   ]
          // }
        })
      uAxios.get('admin/new/user/num')
        .then(res => {

        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
  .line-chart-con{
    height: 300px;
  }
</style>
