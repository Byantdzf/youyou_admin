<template>
  <div class="hello">
    <Menu mode="horizontal" theme="light" active-name="1">
      <MenuItem name="1">
        <Icon type="ios-paper"></Icon>
        活动成员
      </MenuItem>
    </Menu>
    <Row>
      <Col span="11" style="margin: 22px">
        <Card>
          <p slot="title" >基本信息</p>
          <div>
            <img :src="avatar" alt="" width="100rpx" style="box-shadow: 1px 1px 12px #c1c1c1;float: left">
            <span class="_bold" style="font-size: 22px;margin-left: 12px;float: left">{{name}}</span>
            <img src="http://images.ufutx.com/201812/26/e3bda271deea123ba59ae3c5dc2d6657.png" width="24"
                 style="margin-top: 4px" class="float_l" v-if="orgData.sex == 1" alt="男"/>
            <img src="http://images.ufutx.com/201812/26/1b8e3141b47f84969b19e931b070e478.png" v-else
                 style="margin-top: 4px" class="float_l" width="24"/>
            <span class="_bold" style="font-size: 16px;float: left;margin-top: 4px;" v-if="orgData.profile">（推荐人：{{orgData.from_user_name}}）</span>
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
          <Table :columns="columns" :data="information" :show-header="false" :border="false" style="margin-top: 26px;"
                 size="large"></Table>
        </Card>
      </Col>
      <Col span="11" style="margin: 22px">
        <Card>
          <p slot="title" >详细信息</p>

          <!--<Table :columns="columns1" :data="VIPinformation" :show-header="false" :border="false" style="margin-top: 26px" size="large"></Table>-->
          <Table :columns="columns" :data="information1" :show-header="false" :border="false" style="margin-top: 26px;"
                 size="large"></Table>
          <Card style="margin-top: 12px;">
            <p slot="title">生活照</p>
            <span v-for="(item,index) in photos" style="margin: 0 10px;">
						<img :src="item" alt="" width="80rpx" @click="showModal(item,'image')">
					</span>
          </Card>
          <!--<Card style="margin-top: 12px;">-->
          <!--<p slot="title">毕业照</p>-->
          <!--<span v-for="(item,index) in graduate_photos" style="margin: 0 10px;">-->
          <!--<img :src="item" alt="" width="80rpx" @click="showModal(item,'image')">-->
          <!--</span>-->
          <!--</Card>-->
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      :title="message.title_v"
      ok-text="OK"
      no-cancel>
      <!--<p>{{message.type}}</p>-->
      <div style="font-size: 16px">
        <div v-if="message.type_v == 'test'">{{message.content}}</div>
        <div style="text-align: center" v-if="message.type_v == 'image'">
          <img :src="message.image" style="width: 400px;"/>
        </div>
        <div v-if="message.type_v == 'character'">
          <p style="font-weight: bold;margin: 4px;"><span>类型:</span>
          <p>{{character.type}}</p></p>
          <p style="font-weight: bold;margin: 4px;"><span>性格:</span>
          <p>{{character.character}}</p></p>
          <p style="font-weight: bold;margin: 4px;"><span>推荐职位:</span>
          <p v-for="item in character.profession">{{item}}</p></p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api/index'
  import config from '../../api/config'
  //  import md5 from 'js-md5';
  //	import moment from 'moment';
  import dropdown from '../components/dropdown'

  export default {
    name: 'Org',
    components: {
      dropdown: dropdown
    },
    data () {
      return {
        articlesId: '',
        switch1: false,
        redMun: [],    // 红娘列表
        disabled: false,
        user_is_admin: 0,
//                enterprises_id: '', // 默认企业id
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
        activeTab: 'orgInfo',
        orgColumns: [
          {
            key: 'updatedAt',
            width: '150px',
            align: 'right'
          },
          {
            key: 'value',
            align: 'left',
            render: (h, params) => {
              if (params.row.key === 'LOGO') {
                return h('div', [
                  h('Avatar', {
                    props: {
                      src: params.row.value,
                      shape: 'square'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px 0'
                    }
                  })
                ])
              } else {
                return h('div', [
                  h('span', params.row.value)
                ])
              }
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
        character: {},
        message: {},
        client_id: 0,
        uploaddata: []
      }
    },
    methods: {
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
      // 分配用户
      setapproved () {
        let self = this
        uAxios.put(`admin/users/${self.id}/approved`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      // 分配用户
      allocation () {
        if (this.client_id == 0) {
          return this.$Modal.error({
            content: '请选择红娘'
          })
        }
        let self = this
        uAxios.post(`admin/set/matchmaker/${self.client_id}/client/${self.id}`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      change (status) {
        let self = this,
          data = {
            is_admin: Number(status)
          }
        uAxios.put(`admin/set/users/${self.id}/admin`, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
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
        uAxios.get('admin/users/' + self.id + '?page=' + page)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.name = result.name
            self.orgData = result
            self.switch1 = result.is_admin == 0 ? false : true
            self.maker_name = result.maker_name
            self.is_approved = result.is_approved
            self.disabled = result.maker_name == '' ? false : true
            self.avatar = result.avatar
            self.user_is_admin = result.user_is_admin
            self.mobile = result.mobile
            self.love_characters = result.love_characters
            self.love_languages = result.love_languages
            self.character = result.character
            self.photos = result.profile.photos
            self.graduate_photos = result.profile.graduate_photos
            self.other_photos = result.profile.other_photos
            self.identification_photos = result.profile.identification_photos
            self.wechat_qrcode = result.profile.wechat_qrcode
            self.information = [
//                            {
//                                name: '性别',
//                                key: result.sex == '1' ? '男' : '女'
//                            },
              {
                name: '出生日期',
                key: result.profile.birthday
              },
              {
                name: '单身状态',
                key: result.profile.state
              },
              {
                name: '身高',
                key: result.profile.stature + 'cm'
              },
              {
                name: '体重',
                key: result.profile.weight + 'kg'
              },
              {
                name: '常住地',
                key: result.profile.city
              },
              {
                name: '成长环境',
                key: result.profile.resident_type
              },
              {
                name: '成长地',
                key: result.profile.resident_city
              },
              {
                name: '学历',
                key: result.profile.degree
              },
              {
                name: '毕业学校',
                key: result.profile.graduate_school
              },

            ]
            self.information1 = [
              {
                name: '工作单位',
                key: result.profile.company
              },
              {
                name: '单位性质',
                key: result.profile.work_sort
              },
              {
                name: '行业',
                key: result.industry + '~' + result.industry_sub
              },
              {
                name: '加入时间',
                key: result.profile.created_at
              },
              {
                name: '个人简介',
                key: result.profile.introduction
              },
              {
                name: '理想对象',
                key: result.profile.ideal_mate
              }
            ]
            self.VIPinformation = [
              {
                title: '薪资',
                key: result.profile.salary
              },
              {
                title: '购车情况',
                key: result.profile.h_car == 1 ? '有' : '无'
              },

              {
                title: '购房情况',
                key: result.profile.h_housing == 1 ? '有' : '无'
              }
            ]
            self.orgTotal = result.total
            self.loading = false
            // self.searchKeyword = ''

          })
      },
    },
    mounted () {
      this.id = this.$route.params.id
      this.getlist(1)
      this.getmatchmakers()
    }
  }
</script>

<style>
  ._bold {
    font-weight: bold
  }

  .float_l {
    float: left
  }
</style>
