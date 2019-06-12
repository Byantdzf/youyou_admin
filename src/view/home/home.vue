<style lang="less">
  .line-chart-con{
    height: 300px;
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
    <Row class="margin-top-10">
      <Card>
        <p slot="title" class="card-title">
          <Icon type="ios-shuffle-strong"></Icon>
          最近七天注册人数
        </p>
        <h4 style="text-align: center;margin: 22px;">本周营销总收入：{{income}}</h4>
        <div class="line-chart-con">
          <service-requests :option="option"></service-requests>
        </div>
      </Card>
    </Row>
  </div>
</template>

<script>
  import uAxios from '../../api/index';
  import inforCard from './components/inforCard.vue';
  import serviceRequests from './components/serviceRequests.vue';

  export default {
    name: 'home',
    components: {
      inforCard,
      serviceRequests
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
        option: {} // 折线图参数
        //
      };
    },
      methods: {
      changeDate: function (res) {
        this.date = res;
        uAxios.get(`admin/daliy/stat?start_time=${this.date}`)
          .then(res => {
            let result = res.data.data;
            this.count = {
              createUser: result.courtship_count + result.marriage_count,
              collection: result.courtship_count,
              transfer: result.marriage_count
            }
            console.log(this.count)
          });
      },
      getData () {
        let self = this;
        uAxios.get(`admin/daliy/stat?start_time=${this.date}`)
          .then(res => {
            let result = res.data.data;
            this.count = {
              createUser: result.courtship_count + result.marriage_count,
              collection: result.courtship_count,
              transfer: result.marriage_count
            };
          });
        uAxios.get('admin/week/stat')
          .then(res => {
            let result = res.data.data;
            this.Data_arr.xData = result.day_arr;
            this.Data_arr.marriage_arr = result.marriage_arr;
            this.Data_arr.courtship_arr = result.courtship_arr;
            this.income = result.income;
            let self = this;
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
//                                stack: '总量',
                  areaStyle: {normal: {
                      color: '#2d8cf0'
                    }},
                  data: self.Data_arr.marriage_arr
                },
                {
                  name: '单身人数',
                  type: 'line',
                  areaStyle: {normal: {
                      color: '#10A6FF'
                    }},
                  data: self.Data_arr.courtship_arr
                }
              ]
            };
          });
      }
    },
    mounted(){
      var myDate = new Date();
      this.date = `${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`
      this.getData();
    }
  };
</script>
