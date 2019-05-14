<template>
  <div class="hello">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane :label='title' name="detail">
          <Form ref="paasDetail" :model="paasDetail" :label-width="100">
            <FormItem label="平台logo" prop="image">
              <Card>
                <uploadImage v-on:uploadPictures="uploadPicture" :pic="paasDetail.logo"></uploadImage>
              </Card>
            </FormItem>
            <FormItem label="平台名称" prop="name">
              <Input v-model="paasDetail.name" placeholder="Enter paasDetail name"></Input>
            </FormItem>
            <FormItem label="平台标题" prop="name">
              <Row>
                <Input v-model="paasDetail.title" placeholder="Enter paasDetail title"></Input>
              </Row>
            </FormItem>
            <FormItem label="平台简介" prop="name">
              <Row>
                <Input v-model="paasDetail.intro" placeholder="Enter paasDetail intro" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
              </Row>
            </FormItem>
          </Form>
          <div style="text-align: center">
            <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
          </div>
        </TabPane>
        <TabPane label='平台渠道' name="paasPlatform" v-if="id != 0">
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </TabPane>
        <TabPane label='平台同工' name="paasUser" v-if="id != 0">
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import uploadImages from '../components/uploadImages'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'
  import VDistpicker from 'v-distpicker'

  export default {
    components: {
      dropdown,
      uploadImage,
      uploadImages,
      VDistpicker,
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
        title: '平台详情',
        BtnText: '保存修改',
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
        //平台详情
        paasDetail: {}
      }
    },
    methods: {
      editAddress (value) {
        this.paasDetail.address = value.split(' ')[3]
      },
      hideModal (val) {
        this.showMapModel = val
      },
      getLocation (childValue, lnglat) {
        this.address = `${childValue.address}`
        this.paasDetail.province = childValue.province
        this.paasDetail.city = childValue.city
        this.paasDetail.dist = childValue.dist
        this.paasDetail.address = `${childValue.address}`
        this.paasDetail.location_longitude = lnglat[0]
        this.paasDetail.location_latitude = lnglat[1]
      },
      ok () {
        console.log('确定')
      },
      getDate (e) {
        this.paasDetail.start_time = e[0]
        this.paasDetail.end_time = e[1]
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
        this.paasDetail.poster = image // 轮播banna
      },
      uploadPictures (image) {  // 多
        this.paasDetail.detail_pic = image // 详情image
      },
      // 提交表单
      handleSubmit () {
        if (this.id == 0) {
          uAxios.post(`admin/activities`, this.paasDetail).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('创建成功!')
              setTimeout(() => {
                this.$router.push({
                  name: 'paasList'
                })
              }, 800)
            } else {
              alert('操作失败！')
            }
          })
          console.log(this.paasDetail)
          return
        }
        uAxios.put(`admin/activities/${this.id}`, this.paasDetail).then(response => {
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
        uAxios.get('admin/paas/' + self.id)
          .then(res => {
            let result = res.data.data
            this.data = []
            this.address = `${result.address}`
            this.paasDetail = result
            this.date.push(result.start_time)
            this.date.push(result.end_time)
            this.setLocation = [result.location_longitude, result.location_latitude]
            console.log(this.paasDetail)
          })
      },
    },
    mounted () {
      if (this.$route.params.id != 0) {
        this.id = this.$route.params.id
        this.getlist()
        return
      }
      this.title = this.BtnText = '创建平台'
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
