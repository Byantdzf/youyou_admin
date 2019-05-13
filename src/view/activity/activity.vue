<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='title' name="detail">
        <Row>
          <Col span="22" style="margin: 22px">
            <Card>
              <Form ref="activity" :model="activity" :label-width="100">
                <FormItem label="活动轮播" prop="image">
                  <Card>
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="activity.poster"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="活动主题" prop="name">
                  <Input v-model="activity.theme" placeholder="Enter activity theme"></Input>
                </FormItem>
                <FormItem label="主办方" prop="name">
                  <Row>
                    <Input v-model="activity.host" placeholder="Enter activity host"></Input>
                  </Row>
                </FormItem>
                <FormItem label="费用(￥)" prop="number">
                  <Row>
                    <Input v-model="activity.fee" placeholder="例： 99.00" ></Input>
                  </Row>
                </FormItem>
                <FormItem label="详情图片" prop="image">
                  <Card>
                    <uploadImages v-on:uploadPictures="uploadPictures" :pic="activity.detail_pic"></uploadImages>
                  </Card>
                </FormItem>
                <FormItem label="活动说明" prop="name">
                  <Row>
                    <Input v-model="activity.detail" placeholder="Enter activity detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                  </Row>
                </FormItem>
                <FormItem label="详情链接" prop="name">
                  <Row>
                    <Input v-model="activity.detail_path" placeholder="例：http://love.ufutx.com"></Input>
                  </Row>
                </FormItem>
                <FormItem label="活动时间" prop="name">
                  <Row>
                    <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" placement="top" @on-change="getDate"
                                placeholder="Select date and time(Excluding seconds)" style="width: 300px" :value="date"></DatePicker>
                  </Row>
                </FormItem>
                <!--<FormItem label="活动地址" prop="name">-->
                  <!--<Row>-->
                    <!--&lt;!&ndash;<Input v-model="activity.province" placeholder="输入省份" style="max-width: 200px"></Input>&ndash;&gt;-->
                    <!--&lt;!&ndash;<Input v-model="activity.city" placeholder="输入活动城市" style="max-width: 200px"></Input>&ndash;&gt;-->
                    <!--&lt;!&ndash;<Input v-model="activity.dist" placeholder="输入市区" style="max-width: 200px"></Input>&ndash;&gt;-->
                    <!--<v-distpicker @selected="onSelected" :province="activity.province" :city="activity.city" :area="activity.dist"></v-distpicker>-->
                  <!--</Row>-->
                <!--</FormItem>-->
                <FormItem label="活动地址" prop="name">
                  <Row>
                    <!--<Input v-model="activity.address" placeholder="Enter activity address"></Input>-->
                    <Input  placeholder="右侧地图定位选择地址" :value="address" style="width: 68%;margin-right: 22px;"
                            :readonly="address?false:true" @input="editAddress"/>
                    <Button type="primary" @click="showMapModel = true">地图定位</Button>
                  </Row>
                </FormItem>
              </Form>
              <div style="text-align: center">
                <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </TabPane>
      <TabPane label='活动订单' name="activity" v-if="id != 0">
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

  export default {
    name: 'Org',
    components: {
      dropdown,
      uploadImage,
      uploadImages,
      VDistpicker,
      Geolocation
    },
    data () {
      return {
        articlesId: '',
        showMapModel: false,
        address: '',
        switch1: false,
        setLocation: [],
        redMun: [],    // 红娘列表
        disabled: false,
        user_is_admin: 0,
        date: [],
        title: '活动详情',
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
            title: '序号',
            type: 'index',
//                        width: 80,
            align: 'center',
            sortable: true
          },
          {
            title: 'ID',
            key: 'id',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '用户名',
            key: 'user_name',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '头像',
            key: 'avatar',
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
                    let argu = {id: params.row.id}
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
            title: '商品名称',
            key: 'goods',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '支付状态',
            key: 'status',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '金额',
            key: 'price',
            align: 'center',
//                        width: 100,
            editable: true
          },
          {
            title: '消费时间',
            key: 'created_at',
            align: 'center',
//                        width: 100,
            editable: true
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
      editAddress (value) {
        this.activity.address = value.split(' ')[3]
      },
      hideModal (val) {
        this.showMapModel = val
      },
      getLocation (childValue, lnglat) {
        this.address = `${childValue.address}`
        this.activity.province = childValue.province
        this.activity.city = childValue.city
        this.activity.dist = childValue.dist
        this.activity.address = `${childValue.address}`
        this.activity.location_longitude = lnglat[0]
        this.activity.location_latitude = lnglat[1]
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
        if (this.id == 0) {
          uAxios.post(`admin/activities`, this.activity).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('创建成功!')
              setTimeout(() => {
                this.$router.push({
                  name: 'activityList'
                })
              }, 800)
            } else {
              alert('操作失败！')
            }
          })
          console.log(this.activity)
          return
        }
        uAxios.put(`admin/activities/${this.id}`, this.activity).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('保存成功!')
          } else {
            alert('操作失败！')
          }
        })
      },
      getOrder (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/activities/${self.id}/orders?page=` + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data.map((item) => {
              return {
                user_name: item.user ? item.user.name : '',
                avatar: item.user ? item.user.circle_avatar : '',
                goods: item.goods,
                created_at: item.created_at,
                id: item.id,
                id: item.id,
                status: item.pay_status,
                price: item.price
              }
            })
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
            // self.searchKeyword = ''

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
        uAxios.get('admin/activities/' + self.id)
          .then(res => {
            let result = res.data.data
            this.data = []
            this.address = `${result.address}`
            this.activity = result
            this.date.push(result.start_time)
            this.date.push(result.end_time)
            this.setLocation = [result.location_longitude, result.location_latitude]
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
      this.title = this.BtnText = '创建活动'
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
</style>
