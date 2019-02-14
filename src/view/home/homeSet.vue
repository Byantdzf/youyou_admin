<template>
  <div class="hello">
    <!--<Menu mode="horizontal" theme="light" active-name="1">-->
    <!--<MenuItem name="1">-->
    <!--<Icon type="ios-settings" />-->
    <!--首页配置-->
    <!--</MenuItem>-->
    <!--</Menu>-->
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: #ff6c4c;">管理员操作</p>
      <div style="display: inline-block;margin-left: 22px;width: 100%;">
        <Col span="9">
          <Card>
            <!--<dropdown :dropData="redMun" v-on:getGropData="getGropData"  title="请选择用户"  style="display: inline-block;margin-bottom: 12px;"></dropdown>-->
            <Select v-model="client_user_id" style="width: 300px;"  filterable @on-query-change="getGropData">
              <Option v-for="item in redMun" :value="item.id" :key="item.id" >{{ item.name }}</Option>
            </Select>
            <!--<Input placeholder="请搜索用户" style="width: 300px;" />-->
            <Button type="success"  style="display: inline-block; margin-left: 12px;" @click="allocation" >增加征婚推荐</Button>
            <uploadImage v-on:uploadPictures="uploadPictures" style="margin-top: 12px;"></uploadImage>
          </Card>
          <div>
                        <span v-for="item,index in information" :key="index"
                              style="padding: 22px;border-bottom: 2px solid #f6f6f6;display: inline-block;">
                            <img :src="item.photo" alt="" width="100" style="box-shadow: 0px 0px 12px #d3d3d3;">
                            <span style="font-size: 16px;font-weight: bold;margin-left: 22px;">用户名：{{item.name}}</span>
                            <Button type="error" style="margin-left: 22px" @click="deleteUser(item.id)">删除</Button>
                        </span>
          </div>
        </Col>
        <Col span="12" offset="1">
          <Card>
            <p slot="title" style="color: #3bc84d;">首页通知</p>
            <Row>
              <Col span="24" v-for="item,index in messageList" :key="index" style="margin-top: 12px;padding-bottom: 12px;border-bottom: 2px solid #f0f0f0;">
                <Col span="11">
                  <Input v-model="item.title" type="textarea" :rows="5"  placeholder="Enter message..." />
                </Col>
                <Col span="12" offset="1">
                  <Input v-model="item.path" placeholder="跳转路径（path）" style="width: 300px" />
                  <Select v-model="item.type" style="width: 300px;margin-top: 8px;" >
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <DatePicker type="daterange" v-model="item.date" placement="bottom-end" placeholder="通知显示时间" style="width: 220px;margin-top: 8px
;margin-right: 12px"></DatePicker>
                  <Button type="error"  @click="removeMessage(index)">删除</Button>
                </Col>
              </Col>
            </Row>
            <div style="text-align: center;margin-top: 22px;">
              <Button  style="margin: auto;float: left" type="dashed" @click="addMessage" >添加+</Button>
              <Button type="success" size="large"  icon="ios-checkmark"  @click="saveMessage" >保存</Button>
            </div>
          </Card>
        </Col>
      </div>

    </Card>
  </div>
</template>

<script>
import uAxios from '../../api'
import uploadImage from '../components/uploadImage'
import dropdown from '../components/dropdown'

export default {
  name: 'Org',
  components: {
    dropdown: dropdown,
    uploadImage: uploadImage
  },
  data () {
    return {
      articlesId: '',
      switch1: false,
      redMun: [],
      disabled: false,
      user_is_admin: 0,
      information: [],
      loading: false,
      VIPinformation: [],
      poster: '',
      client_user_id: 0,
      searchKeyword: '',
      photo: '',
      activeTab: 'orgInfo',
      character: {},
      uploaddata: [],
      cityList: [
        {
          value: 'OF',
          label: '公众号'
        },
        {
          value: 'MP',
          label: '小程序'
        }
      ],
      messageList: [] // 通知数量
    }
  },
  methods: {
    uploadPictures (image) {
      this.photo = image // 轮播
    },
    getGropData (value) {
      console.log(this.searchKeyword)
      let self = this
      self.loading = true
      uAxios.get(`admin/users?type=single&keyword=${value}`)
        .then(res => {
          let result = res.data.data.data
          this.redMun = result.map((item) => {
            return {
              name: item.name,
              id: item.id
            }
          })
          console.log(this.redMun)
        })
    },
    addMessage () {
      // 增加message数据
      this.messageList.push({
        title: '',
        date: [],
        start_time: '',
        end_time: '',
        path: '',
        type: ''
      })
    },
    removeMessage (index) {
      // 删除message数据
      this.$Notice.warning({
        title: '温馨提示',
        desc: '记得保存之后才会生效哦！'
      })
      this.messageList.splice(index, 1)
    },
    returnDate (date) {
      // 格式化时间 return
      const d = new Date(date)
      var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      return resDate.split(' ')[0]
    },
    saveMessage () {
      for (let item of this.messageList) {
        item.start_time = this.returnDate(item.date[0])
        item.end_time = this.returnDate(item.date[1])
        for (let key in item) {
          if (item[key].toString().replace(/(^\s*)|(\s*$)/g, '') == '') {
            return this.$Message.error('请填写完整信息后再保存！')
          }
        }
      }
      let data = {
        announcement: this.messageList
      }
      uAxios.post(`admin/announcements`, data).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('设置成功')
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },
    gotoUrl (name, name_id, id) {
      let argu = {}
      argu[name_id] = id
      this.$router.push({
        name: name,
        params: argu
      })
    },
    // delete用户
    deleteUser (id) {
      let test_value = confirm('你确定要继续吗？'),
        self = this
      if (test_value) {
        uAxios.delete(`admin/home/recommends/${id}`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('删除成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      }
    },
    // 征婚推荐
    allocation () {
      if (this.client_user_id == 0) {
        return this.$Modal.error({
          content: '请选择会员'
        })
      }
      let self = this
      uAxios.post(`admin/home/recommends?user_id=${self.client_user_id}&photo=${self.photo}`).then((response) => {
        if (response.data.code === 0) {
          this.$Message.info('设置成功')
          location.reload()
        } else {
          this.$Modal.error({
            content: response.data.message
          })
        }
      })
    },

    getlist (page) {
      let self = this
      uAxios.get('admin/home/recommends')
        .then(res => {
          let result = res.data.data
          self.information = result.map((item, index) => {
            return {
              photo: item.photo,
              user_id: item.user_id,
              id: item.id,
              name: item.user.name
            }
          })
        })
      uAxios.get('admin/announcements')
        .then(res => {
          let result = res.data.data
          for (let item of result) {
            this.messageList.unshift({
              title: item.title,
              date: [item.start_time, item.end_time],
              start_time: item.start_time,
              end_time: item.end_time,
              path: item.path,
              type: item.type
            })
          }
        })
    }
  },
  mounted () {
    //            this.$route.params.user_detail_id
    this.id = 1
    this.getlist(1)
  }
}
</script>

<style>
  ._bold{font-weight: bold}
</style>
