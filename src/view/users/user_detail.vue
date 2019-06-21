<template>
  <div class="hello">
    <Menu mode="horizontal" theme="light" active-name="1">
      <MenuItem name="1">
        <Icon type="ios-paper"></Icon>
        用户详情
      </MenuItem>
    </Menu>
    <Row>
      <Card v-if="user_is_admin==1" shadow>
        <p slot="title" style="color: #ff6c4c">管理员操作</p>
        <div style="width: 100%;">
          <Row>
            <i-col span="10">
              <Card>
                <div style="width:100%; padding: 12px;border-bottom: 1px solid #d3d3d3;margin-bottom: 12px;">
                  <div class="font_16 _bold" style="margin-top: 6px;float: left;">账号状态:</div>
                  <Button type="primary" style="margin-left: 22px;float: right;" @click="alterState">确定修改</Button>
                  <Select v-model="type" style="width: 45%;margin-left: 12px;">
                    <Option v-for="item,index in typeList" :value="item.name" :key="index">{{ item.title }}</Option>
                  </Select>
                  <div style="clear: both"></div>
                </div>
                <!--<div style="display: inline-block;margin-left: 12px;">-->
                <!--<span class="font_16 _bold">设置为管理员：</span>-->
                <!--<i-switch v-model="switch1" @on-change="change"/>-->
                <!--</div>-->
                <!--<Dropdown style="margin-left: 20px; position: relative;">-->
                <!--<i-button type="primary">-->
                <!--Ta 的权限：超级管理员-->
                <!--<Icon type="arrow-down-b"></Icon>-->
                <!--</i-button>-->
                <!--<Dropdown-menu slot="list">-->
                <!--<Dropdown-item>超级管理员</Dropdown-item>-->
                <!--<Dropdown placement="right-start">-->
                <!--<Dropdown-item>-->
                <!--平台管理员-->
                <!--<Icon type="arrow-right-b"></Icon>-->
                <!--</Dropdown-item>-->
                <!--<Dropdown-menu slot="list">-->
                <!--<Dropdown-item>挂炉烤鸭</Dropdown-item>-->
                <!--<Dropdown-item>焖炉烤鸭</Dropdown-item>-->
                <!--</Dropdown-menu>-->
                <!--</Dropdown>-->
                <!--<Dropdown-item>红娘</Dropdown-item>-->
                <!--<Dropdown-item>同工</Dropdown-item>-->
                <!--</Dropdown-menu>-->
                <!--&lt;!&ndash;<img src="http://images.ufutx.com/201905/14/30ab7c315c4f5a2670e3e9de537d94d5.png" alt="" style="position: absolute;right: -8px;top: -34px;" width="50px">&ndash;&gt;-->
                <!--</Dropdown>-->
                <Button type="info" style="margin-left: 32px;display: inline-block;" @click="setapproved"
                        v-if="is_approved == 0">
                  授权该用户为实名认证用户
                </Button>
                <Button type="success" style="margin-left: 18px;display: inline-block;" v-if="is_audited == 0"
                        @click="auditUser">标记为已审核
                </Button>
              </Card>
            </i-col>
            <i-col span="13" offset="1">
              <Card>
                <Select v-model="client_id" style="width: 300px;" filterable @on-query-change="getGropData">
                  <Option v-for="item in redMun" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Button type="success" style="margin-left: 8px" @click="allocation">将该用户分配给这位红娘</Button>
                <span style="color: red;margin-left: 12px" v-if="maker_name">{{maker_name}} 已跟进</span>
              </Card>
            </i-col>
          </Row>
        </div>
      </Card>
      <Col span="10" style="margin: 22px 0;position: relative">
        <Card>
          <p slot="title" style="color: #ff6c4c">用户信息</p>
          <div style="display: inline-block">
            <span class="font_16 _bold">头像：<img
              :src="avatar?avatar:'http://images.ufutx.com/201905/13/599151d27fc07ba1bc4cc57a291525e5.jpeg'" alt=""
              width="80px" height="80px" style="box-shadow: 1px 1px 12px #c1c1c1"
              @click="showModal(avatar,'image')"></span>
          </div>
          <div style="display: inline-block;margin-left: 42px;">
            <span class="font_16 _bold">用户名：</span>
            <span class="font_16">{{name}}</span>
          </div>
          <img src="http://images.ufutx.com/201905/13/61d92561553c6632cd2ac02924d0872e.png" alt=""
               v-if="is_approved == 0" style="position: absolute;left: 110px;top: 100px;" width="62">
          <img src="http://images.ufutx.com/201905/13/8d1228814a8697fc3de9d6b8b9c127f4.png" alt="" v-else
               style="position: absolute;left: 110px;top: 100px;" width="62">
          <img src="http://images.ufutx.com/201905/13/c4b37a0ffebbfdd9320c57e6d8e453b3.png" alt=""
               v-if="is_audited == 0" style="margin-left: 12px;margin-bottom: -16px;" width="62">
          <img src="http://images.ufutx.com/201905/13/20626fbd174313d584176c1d6bc74ef3.png" alt="" v-else
               style="margin-left: 12px;margin-bottom: -16px;" width="62">
          <div style="display: inline-block;margin-top: 22px;" v-if="user_is_admin==1">
            <Card>
              <Button type="primary" style="margin-left: 8px;margin-bottom: 8px;" @click="gotoEdit">编辑用户</Button>
              <Button type="warning" style="margin-left: 8px;margin-bottom: 8px;" @click="gotoUrl('user_order','id',id)">用户订单</Button>
              <Button type="warning" style="margin-left: 8px;margin-bottom: 8px;background-image: linear-gradient(-225deg, #A445B2 0%, #D41872 52%, #FF0066 100%);color: white;" @click="gotoUrl('userMembers','id',id)">用户会员</Button>
              <Button type="success" style="margin-left: 8px;margin-bottom: 8px;" @click="gotoUrl('user_integral','id',id)">福分记录</Button>
              <Button type="info" style="margin-left: 8px;margin-bottom: 8px;" @click="gotoUrl('user_gift','id',id)">礼物列表</Button>
              <Button type="error" style="margin-left: 8px;margin-bottom: 8px;" @click="showDeleteUser">删除用户</Button>
              <Button style="margin-left: 8px;margin-bottom: 8px;" @click="settNote">备注管理</Button>
            </Card>
          </div>
          <Table :columns="columns" :data="information" :show-header="false" :border="false"
                 style="margin-top: 26px"></Table>
        </Card>
      </Col>
      <Col span="13" offset="1" style="margin-top: 22px;position: relative">
        <Card>
          <p slot="title" style="color: #ff6c4c">VIP信息</p>
          <Table :columns="columns1" :data="VIPinformation" :show-header="false" :border="false"
                 style="margin-top: 26px"></Table>
          <Card style="margin-top: 12px;">
            <p slot="title">生活照</p>
            <span v-for="(item,index) in lifePhotos" style="margin: 0 10px;">
						<img :src="item.photo" alt="" width="80rpx" style="margin-right: 6px;border: 2px solid #f3f3f3;"
                 @click="showModal(item.photo,'image')">
					</span>
          </Card>
          <!--<Card style="margin-top: 12px;">-->
          <!--<p slot="title">身份证</p>-->
          <!--<span v-for="(item,index) in identification_photos" style="margin: 0 10px;">-->
          <!--<img :src="item" alt="" width="80rpx" @click="showModal(item,'image')">-->
          <!--</span>-->
          <!--</Card>-->
          <!--<Card style="margin-top: 12px;">-->
          <!--<p slot="title">毕业照</p>-->
          <!--<span v-for="(item,index) in graduate_photos" style="margin: 0 10px;">-->
          <!--<img :src="item" alt="" width="80rpx" @click="showModal(item,'image')">-->
          <!--</span>-->
          <!--</Card>-->
          <!--<Card style="margin-top: 12px;">-->
          <!--<p slot="title">其他证件</p>-->
          <!--<span v-for="(item,index) in other_photos" style="margin: 0 10px;">-->
          <!--<img :src="item" alt="" width="80rpx" @click="showModal(item,'image')">-->
          <!--</span>-->
          <!--</Card>-->
          <Card style="margin-top: 12px;">
            <p slot="title">二维码</p>
            <span v-for="(item,index) in wechat_qrcode" style="margin: 0 10px;">
						<img :src="item" alt="" width="80rpx" @click="showModal(item,'image')">
					</span>
          </Card>
          <Card style="margin-top: 12px;">
            <p slot="title">测试结果</p>
            <p
              style="border-bottom: 1px solid #d3d3d3;padding: 6px;display: inline-block;color: #00a050;font-weight: bold">
              爱情语言</p>
            <div style="border-bottom: 1px solid #d3d3d3;padding: 6px;padding-right: 22px;"
                 v-for="item in love_languages" @click="showModal(item,'test')">
              <span>{{item.title}}</span>
              <Icon type="chevron-right" style="float: right;margin-top: 4px;margin-left: 22px;"></Icon>
              <span style="float: right">{{item.num}}</span>
            </div>
            <p
              style="border-bottom: 1px solid #d3d3d3;padding: 6px;display: inline-block;color: #a03a17;font-weight: bold">
              交往基因</p>
            <div style="border-bottom: 1px solid #d3d3d3;padding: 6px;padding-right: 22px;"
                 v-for="item in love_characters" @click="showModal(item,'test')">
              <span>{{item.title}}</span>
              <Icon type="chevron-right" style="float: right;margin-top: 4px;margin-left: 22px;"></Icon>
              <span style="float: right">{{item.num}}</span>

            </div>
            <div style="border-bottom: 1px solid #d3d3d3;padding: 6px;padding-right: 22px;"
                 @click="showModal(character,'character')">
              <span style="color: #ff1837;font-weight: bold">我的优势</span>
              <Icon type="chevron-right" style="float: right;margin-top: 4px;"></Icon>
            </div>
          </Card>
          <Card style="margin-top: 12px;">
            <p slot="title">推荐用户<span style="color: #ff0c18;font-weight: bold">（{{recommendTotal}}人）</span></p>
            <Table :loading="loading" :columns="recommendColumns" :data="recommendData" style="width: 100%;"
                   border></Table>
            <Page :total="recommendTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
            <div style="clear: both"></div>
          </Card>
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
    <Modal
      v-model="modal1"
      title='温馨提示'
      ok-text="OK"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否确认删除该用户？</p>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api'
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
        redMun: [], // 红娘列表
        disabled: false,
        loading: false,
        type: '',
        typeList: [
          {
            title: '单身',
            name: 'single'
          },
          {
            title: '恋爱',
            name: 'loveing'
          },
          {
            title: '介绍人',
            name: 'marriage'
          }],
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
        recommendColumns: [
          {
            title: 'id',
            align: 'center',
            key: 'id'
          },
          {
            title: 'Name',
            align: 'center',
            key: 'name'
          },
          {
            title: '性别',
            width: 50,
            align: 'center',
            key: 'sex'
          },
          {
            title: '会员等级',
            align: 'center',
            key: 'rank'
          },
          {
            title: '实名认证？',
            align: 'center',
            key: 'is_approved'
          },
          {
            title: '单身？介绍人？',
            align: 'center',
            key: 'type'
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
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {id: params.row.id}
                      const {href} = this.$router.resolve({
                        name: 'user_detail',
                        params: argu
                      })
                      window.open(href, '_blank')
                    }
                  }
                }, '用户详情')
              ])
            }
          }
        ],
        recommendData: [],
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
        recommendTotal: 0,
        orgTotal: 0,
        modal: false,
        modal1: false,
        name: '',
        mobile: '',
        avatar: '',
        maker_name: '',
        is_approved: '',
        is_audited: '',
        photos: [],
        lifePhotos: [],
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
      alterState () {
        console.log()
        uAxios.put(`admin/users/${this.id}?type=${this.type}`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('修改成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      showDeleteUser () {
        this.modal1 = true
      },
      handlePage (num) {
        this.recommend(num)
      },
      gotoEdit () {
        // return  this.$Modal.error({
        //     content: '此功能正在开发...'
        // });
        let argu = {edit_id: this.id}
        this.$router.push({
          name: 'edit_user_detail',
          params: argu
        })
      },
      auditUser () {
        // 审核用户
        let self = this
        uAxios.put('admin/audit/users/' + self.id).then((response) => {
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
      deleteUser () {
        let self = this
        uAxios.delete('admin/users/' + self.id).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('删除成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
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
      gotoUrl (name, name_id, id) {
        let argu = {}
        argu[name_id] = id
        this.$router.push({
          name: name,
          params: argu
        })
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
      getGropData (value) {
        console.log(this.searchKeyword)
        let self = this
        self.loading = true
        uAxios.get(`admin/matchmakers?type=single&keyword=${value}`)
          .then(res => {
            let result = res.data.data.data
            this.redMun = result.map((item) => {
              return {
                name: item.name,
                id: item.id
              }
            })
            console.log(this.redMun)
          }).catch(() => {
          self.loading = false
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
          this.message.image = item ? item : 'http://images.ufutx.com/201905/13/599151d27fc07ba1bc4cc57a291525e5.jpeg'
        } else {
          this.modal = true
          this.message.title_v = '了解自己的优势'
          this.message.type_v = 'character'
        }
        console.log(this.message)
      },
      recommend (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/users/${self.id}/invite/users?page=${page}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.recommendData = result.data.map((item) => {
              return {
                avatar: item.avatar,
                created_at: item.created_at,
                id: item.id,
                mobile: item.mobile,
                name: item.name,
                sex: item.sex == 1 ? '男' : '女',
                type: item.type == 'single' ? '单身' : '介绍人',
                from_name: item.from_name,
                rank: item.rank_name,
                is_approved: item.is_approved == '0' ? '未认证' : '已认证'
              }
            })
            self.recommendTotal = result.total
            self.loading = false
            // self.searchKeyword = ''
          }).catch(() => {
          self.loading = false
        })
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get('admin/users/' + self.id + '?page=' + page)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.name = result.name
            self.type = result.type
            self.switch1 = result.is_admin != 0
            self.maker_name = result.maker_name
            self.is_approved = result.is_approved
            self.is_audited = result.is_audited
            self.disabled = result.maker_name != ''
            self.avatar = result.avatar
            self.user_is_admin = result.user_is_admin
            self.mobile = result.mobile
            self.love_characters = result.love_characters
            self.love_languages = result.love_languages
            self.character = result.character
            // self.photos = result.profile.photos
            self.lifePhotos = result.lifePhotos
            self.graduate_photos = result.profile.graduate_photos
            self.other_photos = result.profile.other_photos
            self.identification_photos = result.profile.identification_photos
            self.wechat_qrcode = result.profile.wechat_qrcode
            self.information = [
              {
                name: '会员等级',
                key: result.rank_name
              },
              {
                name: '会员期限',
                key: result.deadline
              },
              {
                name: 'openid',
                key: result.openid
              },
              {
                name: '手机号',
                key: result.mobile
              },
              {
                name: '类型',
                key: result.type == 'single' ? '单身' : '介绍人'
              },

              {
                name: '性别',
                key: result.sex == '1' ? '男' : '女'
              },
              {
                name: '出生日期',
                key: result.profile.birthday
              },
              {
                name: '单身状态',
                key: result.profile.state
              },
              {
                name: '信仰',
                key: result.profile.belief
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
                name: '推荐人',
                key: result.from_user_name
              },
              {
                name: 'VIP等级',
                key: result.rank_name
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
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.getlist(1)
      this.recommend(1)
    }
  }
</script>

<style>
  ._bold {
    font-weight: bold
  }
</style>
