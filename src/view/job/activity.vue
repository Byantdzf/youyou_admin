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
                <FormItem label="兼职名称" prop="name">
                  <Input v-model="jobData.title" placeholder="Enter title"></Input>
                </FormItem>
                <FormItem label="兼职状态" prop="name" v-if="id!==0">
                  <!--<span style="color: red;">{{jobData.typeName}}</span>-->
                  <RadioGroup v-model="jobData.typeName" @on-change="setStatus">
                    <Radio label="上架"></Radio>
                    <Radio label="下架"></Radio>
                    <Radio label="取消"></Radio>
                    <Radio label="结束"></Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="报名人数(人)" prop="number" v-if="id!==0">
                  <span style="color: red;">{{jobData.joined_num}}</span>
                </FormItem>
                <FormItem label="报酬(￥)" prop="number">
                  <Row>
                    <Input v-model="jobData.reward" placeholder="例： 99"></Input>
                  </Row>
                </FormItem>
                <FormItem label="招聘人数(人)" prop="number">
                  <Row>
                    <Input v-model="jobData.need_num" placeholder="人数"></Input>
                  </Row>
                </FormItem>
                <FormItem label="兼职类型" prop="number">
                  <Cascader :data="jobTypeData" v-model="jobTypeValue" style="max-width:184px"></Cascader>
                </FormItem>
                <FormItem label="兼职时间" prop="name">
                  <Row>
                    <DatePicker type="date" format="yyyy-MM-dd HH:mm" placement="top" @on-change="getDate"
                                placeholder="Select date and time(Excluding seconds)" style="max-width: 400px;"
                                :value="jobData.job_time"></DatePicker>
                  </Row>
                </FormItem>
                <FormItem label="结算方式" prop="number">
                  <Select v-model="jobData.pay_type" style="max-width:184px">
                    <Option v-for="item,index in payType" :value="item.type" :key="index">{{ item.title }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="联系人" prop="number">
                  <Row>
                    <Input v-model="jobData.linkman" placeholder="名称"></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人电话" prop="number">
                  <Row>
                    <Input v-model="jobData.link_mobile" placeholder="联系电话"></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人微信" prop="number">
                  <Row>
                    <Input v-model="jobData.wechat" placeholder="微信号"></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人邮箱" prop="number">
                  <Row>
                    <Input v-model="jobData.link_email" placeholder="邮箱"></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系地址" prop="name">
                  <Row>
                    <Input placeholder="右侧地图定位选择地址" :value="address" style="max-width: 400px;margin-right: 22px;"
                           :readonly="address?false:true" @input="editAddress"/>
                    <Button type="primary" @click="showMapModel = true">地图定位</Button>
                  </Row>
                </FormItem>
                <FormItem label="兼职介绍" prop="name">
                  <editor ref="editor" @on-change="handleChange"/>
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
      <Geolocation @getLocation="getLocation" @hideModal="hideModal" :setLocation="setLocation"></Geolocation>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api/index'
  import config from '../../api/config'
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
    watch: {
      value1(){
        console.log(this.value1)
      }
    },
    data () {
      return {
        jobTypeValue: [1, 1], // 类型
        jobTypeData: [], // 类型数组
        intro: '',
        jobData: {},
        articlesId: '',
        showMapModel: false,
        address: '',
        switch1: false,
        Index: 0,
        setLocation: [],
        disabled: false,
        user_is_admin: 0,
        date: [],
        title: '兼职详情',
        BtnText: '保存',
        loading: false,
        payType: [
          {
            title: '日结',
            type: 'DAILY'
          },
          {
            title: '月结',
            type: 'MONTHLY'
          }
        ],
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
        this.jobData.pic = image // 轮播banna
      },
      uploadPictures (image) {  // 多
        this.jobData.detail_pic = image // 详情image
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
      getOrder (page) { // 用户列表
        let self = this
        self.loading = true
        uAxios.get(`admin/jobs/${self.id}/members?page=` + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            self.orgTotal = result.total
            self.loading = false
          })
      },
      // 赋值子类型
      getJobChildren (item) {
        let subs = []
        for (let item_son of item) {
          subs.push(
            {
              value: item_son.id,
              label: item_son.name
            }
          )
        }
        return subs
      },
      getJobType () {
        let vm = this
        uAxios.get('admin/job/categories?nopage=1')
          .then(res => {
            let result = res.data.data
            console.log(result)
            let typeList = []
            for (let item of result) {
              typeList.push(
                {
                  value: item.id,
                  label: item.name,
                  children: vm.getJobChildren(item.sub_categories)
                }
              )
            }
            vm.jobTypeData = typeList
          })
      },
      handlePage (num) {
        // 分页
        this.getOrder(num)

      },
      setStatus () {
        let status = ''
        switch (this.jobData.typeName) {
          case '上架':
            status = 'UNDERWAY'
            break
          case '结束':
            status = 'FINISHED'
            break
          case '下架':
            status = 'UNPLAYED'
            break
          case '取消':
            status = 'CANCELED'
            break
        }
        uAxios.put(`admin/jobs/${this.id}/status?status=${status}`)
          .then(res => {
            this.$Message.info('操作成功')
          })
      },
      getlist (page = 1) {
        let vm = this
        vm.loading = true
        uAxios.get(`admin/jobs/${vm.id}`)
          .then(res => {
            let result = res.data.data
            vm.jobTypeValue = [result.category.parent_id, result.category.id]
            vm.jobData = result
            switch (result.status) {
              case 'UNDERWAY':
                vm.jobData.typeName = '上架'
                break
              case 'FINISHED':
                vm.jobData.typeName = '结束'
                break
              case 'UNPLAYED':
                vm.jobData.typeName = '下架'
                break
              case 'CANCELED':
                vm.jobData.typeName = '取消'
                break
            }
            vm.$refs.editor.setHtml(result.intro)
            vm.data = []
            vm.address = `${result.address}`
            vm.setLocation = [result.lng, result.lat]
          })
      },
    },
    created () {
    },
    mounted () {
      this.getJobType()
      if (this.$route.params.id != 0) {
        this.id = this.$route.params.id
        this.getlist()
        return
      }
      this.$refs.editor.setHtml('')
      this.title = this.BtnText = '新增兼职'
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }

  #container {
    width: 300px;
    height: 180px;
  }

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

  Input {
    max-width: 400px;
  }
</style>
