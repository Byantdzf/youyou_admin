<template>
  <div class="hello">
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: #ff6c4c;">小助手信息</p>
        <Input
          v-model="searchKeyword"
          @on-enter="handleSearch"
          placeholder="关键字搜索..."
          style="width: 200px; margin-bottom: 22px;"/>
        <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                </span>
        <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
        <!--<Col span="9">-->
          <!--<Card>-->
            <!--<Select v-model="client_id" style="width: 300px;" filterable @on-query-change="getGropData">-->
              <!--<Option v-for="item in redMun" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
            <!--</Select>-->
            <!--<Button type="success" style="display: inline-block; margin-left: 12px;" @click="allocation">增加征婚推荐</Button>-->
            <!--<uploadImage v-on:uploadPictures="uploadPictures" style="margin-top: 12px;"></uploadImage>-->
          <!--</Card>-->
        <!--</Col>-->
        <!--<Col span="12" offset="1">-->
          <!--<Card>-->
            <!--<p slot="title" style="color: #3bc84d;">首页通知</p>-->
            <!--<Row>-->
              <!--<Col span="24" v-for="item,index in messageList" :key="index"-->
                   <!--style="margin-top: 12px;padding-bottom: 12px;border-bottom: 2px solid #f0f0f0;">-->
                <!--<Col span="11">-->
                  <!--<div  @click="getIndex(index)">-->
                    <!--<informPic v-on:uploadPictures="uploadInformPic" :pic="item.pic"></informPic>-->
                  <!--</div>-->
                  <!--<Input v-model="item.title" type="textarea" placeholder="Enter message..."/>-->
                <!--</Col>-->
                <!--<Col span="12" offset="1">-->
                  <!--<Input v-model="item.path" placeholder="跳转路径（path）" style="width: 300px"/>-->
                  <!--<Select v-model="item.type" style="width: 300px;margin-top: 8px;">-->
                    <!--<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                  <!--</Select>-->
                  <!--<DatePicker type="daterange" v-model="item.date" placement="bottom-end" placeholder="通知显示时间" style="width: 220px;margin-top: 8px-->
<!--;margin-right: 12px"></DatePicker>-->
                  <!--<Button type="error" @click="removeMessage(index)">删除</Button>-->
                <!--</Col>-->
              <!--</Col>-->
            <!--</Row>-->
            <!--<div style="text-align: center;margin-top: 22px;">-->
              <!--<Button style="margin: auto;float: left" type="dashed" @click="addMessage">添加+</Button>-->
              <!--<Button type="success" size="large" icon="ios-checkmark" @click="saveMessage">保存</Button>-->
            <!--</div>-->
          <!--</Card>-->
        <!--</Col>-->

    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'

  export default {
    name: 'massTexting',
    components: {
      dropdown: dropdown,
      uploadImage: uploadImage,
      informPic: uploadImage
    },
    data () {
      return {
        searchKeyword: '',
        loading: false,
        orgColumns: [
          {
            title: '处理ID',
            width: 80,
            key: 'feedbackId',
            align: 'center',
          },
          {
            title: '反馈人ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '反馈人',
            key: 'user_name',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '反馈人头像',
            key: 'user_avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.user_avatar
                },
                style: {
                  width: '42px',
                  height: '42px',
                  marginTop: '6px',
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
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
            title: '联系方式',
            key: 'user_mobile',
            align: 'center',
            editable: true
          },
          {
            title: '反馈内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '反馈时间',
            key: 'created_at',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  on: {
                    click: () => {
                      this.modal = true
                      this.feedbackItem = params.row
                      this.feedbackIndex = params.index
                      // console.log(params.index)
                    }
                  }
                }, '查看反馈详情')
              ])
            }
          }
        ],
        articlesId: '',
        switch1: false,
        redMun: [],
        disabled: false,
        user_is_admin: 0,
        information: [],
        loading: false,
        VIPinformation: [],
        poster: '',
        client_id: 0,
        searchKeyword: '',
        photo: '',
        activeTab: 'orgInfo',
        informIndex: 0,
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
      uploadInformPic (image) {
        console.log(this.informIndex)
        this.messageList[this.informIndex].pic = image // 轮播
      },
      getIndex (index) {
        this.informIndex = index
      },
      handleSearch () {
        debugger
        // 搜索
        let query = 'keyword=' + this.searchKeyword
        let self = this
        let page = 1
        uAxios.get(`admin/feedbacks?page=${page}&${query}&status=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            self.orgTotal = result.total
            self.searchKeyword = ''
          })
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
          type: '',
          pic: ''
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
        console.log(this.messageList)
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

      getlist (page) {
        let self = this
        uAxios.get('admin/assistant/messages')
          .then(res => {
            let result = res.data.data
            console.log(result.data)
            // self.information = result.map((item, index) => {
            //   return {
            //     photo: item.photo,
            //     id: item.id,
            //     id: item.id,
            //     name: item.user.name
            //   }
            // })
          })
      }
    },
    mounted () {
      this.id = 1
      this.getlist(1)
    }
  }
</script>

<style>
  ._bold {
    font-weight: bold
  }
</style>
