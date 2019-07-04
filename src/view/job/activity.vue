<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='title' name="detail">
        <Row>
          <Col span="22" style="margin: 22px">
            <Card>
              <Form ref="activity" :model="activity" :label-width="100">
                <FormItem label="兼职图片" prop="image">
                  <Card style="max-width: 400px;">
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="jobData.pic"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="兼职名称" prop="name" >
                  <Input v-model="jobData.title" placeholder="Enter title"></Input>
                </FormItem>
                <FormItem label="兼职类型" prop="name" v-if="id!==0">
                  <span style="color: red;">{{jobData.typeName}}</span>
                </FormItem>
                <FormItem label="报名人数(人)" prop="number" v-if="id!==0">
                  <span style="color: red;">{{jobData.joined_num}}</span>
                </FormItem>
                <FormItem label="报酬(￥)" prop="number">
                  <Row>
                    <Input v-model="jobData.reward" placeholder="例： 99" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="招聘人数(人)" prop="number">
                  <Row>
                    <Input v-model="jobData.need_num" placeholder="人数" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="兼职时间" prop="name">
                  <Row>
                    <DatePicker type="date" format="yyyy-MM-dd HH:mm" placement="top" @on-change="getDate"
                                placeholder="Select date and time(Excluding seconds)" style="max-width: 400px;" :value="jobData.job_time"></DatePicker>
                  </Row>
                </FormItem>
                <FormItem label="联系人" prop="number">
                  <Row>
                    <Input v-model="jobData.linkman" placeholder="名称" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人电话" prop="number">
                  <Row>
                    <Input v-model="jobData.link_mobile" placeholder="联系电话" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人微信" prop="number">
                  <Row>
                    <Input v-model="jobData.wechat" placeholder="微信号" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人邮箱" prop="number">
                  <Row>
                    <Input v-model="jobData.link_email" placeholder="邮箱" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系地址" prop="name">
                  <Row>
                    <Input  placeholder="右侧地图定位选择地址" :value="address" style="max-width: 400px;margin-right: 22px;"
                            :readonly="address?false:true" @input="editAddress"/>
                    <Button type="primary" @click="showMapModel = true">地图定位</Button>
                  </Row>
                </FormItem>
                <FormItem label="兼职介绍" prop="name">
                  <editor ref="editor" @on-change="handleChange"/>
                  <!--<button @click="changeContent">修改编辑器内容</button>-->
                </FormItem>
              </Form>
              <div style="text-align: center">
                <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </TabPane>
      <TabPane label='报名成员' name="activity" v-if="id != 0">
        <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
              style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
      </TabPane>
    </Tabs>
    <Modal v-model="showMapModel" width="860" title="活动地址" @on-ok="ok">
      <Geolocation  @getLocation="getLocation"  @hideModal="hideModal" :setLocation="setLocation" ></Geolocation>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api/index'
  import config from '../../api/config'
  //  import md5 from 'js-md5';
  //	import moment from 'moment';
  import Geolocation from '../components/Geolocation'
  import uploadImages from '../components/uploadImages'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'
  import VDistpicker from 'v-distpicker'
  import Editor from '_c/editor'


  export default {
    components: {
      dropdown,
      uploadImage,
      uploadImages,
      VDistpicker,
      Geolocation,
      Editor
    },
    data () {
      return {
        intro: '',
        jobData: {},
        articlesId: '',
        showMapModel: false,
        address: '',
        switch1: false,
        Index: 0,
        setLocation: [],
        redMun: [],    // 红娘列表
        disabled: false,
        user_is_admin: 0,
        date: [],
        title: '兼职详情',
        BtnText: '保存',
        loading: false,
        columns: [
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'key'
          }
        ],
        columns1: [
          {
            title: 'Name',
            key: 'title'
          },
          {
            title: 'Age',
            key: 'key'
          }
        ],
        information: [],
        VIPinformation: [],
        searchKeyword: '',
        activeTab: 'detail',
        orgColumns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '用户ID',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.user.id)
            }
          },
          {
            title: '用户名',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.user.name)
            }
          },
          {
            title: '头像',
            key: 'avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.user.avatar
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
            width: 80,
            align: 'center'
          },
          {
            title: '报名时间',
            key: 'created_at',
            align: 'center',
            editable: true
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
                      this.$router.push({
                        name: 'user_detail',
                        params: argu
                      })
                    }
                  }
                }, '查看详情')
              ])
            }
          }
        ],
        orgData: [],
        total: 0,
        orgTotal: 0,
        modal: false,
        name: '',
        mobile: '',
        avatar: '',
        maker_name: '',
        is_approved: '',
        photos: [],
        graduate_photos: [],
        other_photos: [],
        identification_photos: [],
        wechat_qrcode: [],
        love_characters: [],
        love_languages: [],
        access: localStorage.getItem('access'),
        character: {},
        message: {},
        client_id: 0,
        uploaddata: [],
        id: 0,
        //活动详情
        activity: {}
      }
    },
    methods: {
      handleChange (html, text) {
        this.intro = html
        console.log(this.intro)
      },
      changeContent () {
        this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
      },
      editAddress (value) {
        this.activity.address = value.split(' ')[3]
      },
      hideModal (val) {
        this.showMapModel = val
      },
      getLocation (childValue, lnglat) {
        this.address = `${childValue.address}`
        this.jobData.province = childValue.province
        this.jobData.city = childValue.city
        this.jobData.dist = childValue.dist
        this.jobData.address = `${childValue.address}`
        this.jobData.lng = lnglat[0]
        this.jobData.lat = lnglat[1]
      },
      ok () {
        console.log('确定')
      },
      getDate (e) {
        this.activity.start_time = e[0]
        this.activity.end_time = e[1]
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getOrder(1)
      },
      settNote () {
        let argu = {id: this.id}
        this.$router.push({
          name: 'user_note',
          params: argu
        })
      },
      getGropData (_id) {
        this.client_id = _id
      },
      uploadPicture (image) {  // 单
        this.activity.poster = image // 轮播banna
      },
      uploadPictures (image) {  // 多
        this.activity.detail_pic = image // 详情image
      },
      // 提交表单
      handleSubmit () {
        this.jobData.intro = this.intro
        if (this.id == 0) {
          uAxios.post(`admin/jobs`, this.jobData).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('创建成功!')
              setTimeout(() => {
                this.$router.push({
                  name: 'jobList'
                })
              }, 800)
            } else {
              alert('操作失败！')
            }
          })
          console.log(this.activity)
          return
        }
        console.log(this.jobData)
        uAxios.put(`admin/jobs/${this.id}`, this.jobData).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('保存成功!')
          } else {
            alert('操作失败！')
          }
        })
      },
      refund (id, name) {
        let self = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: `<p>是否 <span class="_bold">${name}</span>执行 <span style="color: orange">"申请退款"</span> 操作？</p>`,
          onOk: () => {
            uAxios.post(`admin/activity/members/${id}/refund`)
              .then(res => {
                if (res.data.code === 0) {
                  setTimeout(() => {
                    this.$Modal.remove();
                    this.$Message.info('操作成功');
                  }, 200);
                  self.information.splice(this.Index,1)
                } else {
                  alert('操作失败！')
                }
              })
          }
        });
      },
      getOrder (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/jobs/${self.id}/members?page=` + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
      getmatchmakers () {
        let self = this
        self.loading = true
        uAxios.get('admin/matchmakers?nopage=1&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            this.redMun = result.map((item) => {
              return {
                name: item.name,
                id: item.id
              }
            })
            console.log(this.redMun)
          })
      },
      handlePage (num) {
        // 分页
        this.getOrder(num)

      },
      showModal (item, type) {
        console.log(this.character)
        if (type == 'test') {
          this.modal = true
          this.message = item
          this.message.type_v = 'test'
          this.message.title_v = item.title
        } else if (type == 'image') {
          this.modal = true
          this.message.title_v = '预览'
          this.message.type_v = 'image'
          this.message.image = item
        } else {
          this.modal = true
          this.message.title_v = '了解自己的优势'
          this.message.type_v = 'character'
        }
        console.log(this.message)
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/jobs/${self.id}`)
          .then(res => {
            console.log(res, '999999')
            let result = res.data.data
            this.jobData = result
            switch (result.status) {
              case 'UNDERWAY':
                this.jobData.typeName = '进行中'
                break
              case 'FINISHED':
                this.jobData.typeName = '已结束'
                break
              case 'UNPLAYED':
                this.jobData.typeName = '待开始'
                break
              case 'CANCELED':
                this.jobData.typeName = '已取消'
                break
            }
            this.$refs.editor.setHtml(result.intro)
            this.data = []
            this.address = `${result.address}`
            // this.activity = result
            // this.date.push(result.start_time)
            // this.date.push(result.end_time)
            this.setLocation = [result.lng, result.lat]
            console.log(this.activity)
          })
      },
    },
    mounted () {
      if (this.$route.params.id != 0) {
        this.id = this.$route.params.id
        this.getlist()
        return
      }
      this.$refs.editor.setHtml('')
      this.title = this.BtnText = '新增兼职'
      this.activity.host = localStorage.getItem('paas')
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }
  #container {width:300px; height: 180px;}

  .float_l {
    float: left
  }
  .distpicker-address-wrapper select {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 12px !important;
    margin-right: 12px !important;
    font-size: 14px !important;
  }
  Input{
    max-width: 400px;
  }
</style>
