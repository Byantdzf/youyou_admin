<template>
  <div class="hello">
    <Menu mode="horizontal" theme="light" active-name="1">
      <MenuItem name="1">
        <Icon type="ios-paper"></Icon>
        用户详情
      </MenuItem>
    </Menu>
    <Row>
      <Card shadow>
        <p slot="title" style="color: #ff6c4c">管理员操作</p>
        <div style="width: 100%;">
          <Row>
            <i-col span="10">
              <Card>
                <div style="width:100%; padding: 12px;border-bottom: 1px solid #d3d3d3;margin-bottom: 12px;">
                  <span class="font_16 _bold" style="margin-right: 12px;">屏蔽该账户:</span>
                  <Radio-group v-model="closeCode" @on-change="shieldUser">
                    <Radio label="关闭"></Radio>
                    <Radio label="开启"></Radio>
                  </Radio-group>
                  <div style="clear: both"></div>
                </div>
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
          <Table :columns="columns" :data="information" :show-header="false" :border="false"
                 style="margin-top: 26px"></Table>
        </Card>
      </Col>
      <Col span="13" offset="1" style="margin-top: 12px;position: relative">
          <Card style="margin-top: 12px;">
            <p slot="title">已报名兼职<span style="color: #ff0c18;font-weight: bold">（{{recommendTotal}}）</span></p>
            <Table :loading="loading" :columns="recommendColumns" :data="recommendData" style="width: 100%;"
                   border></Table>
            <Page :total="recommendTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
            <div style="clear: both"></div>
          </Card>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      :title="message.title_v"
      ok-text="OK"
      no-cancel>
      <div v-if="message.type_v == 'test'">{{message.content}}</div>
      <div style="text-align: center" v-if="message.type_v == 'image'">
        <img :src="message.image" style="width: 400px;"/>
      </div>
    </Modal>
    <Modal
      v-model="modal1"
      title="兼职内容"
      ok-text="查看详情"
      @on-ok="jobDetail"
      no-cancel>
      <div class="job_class">名称：{{job.title}}</div>
      <div class="job_class">时间：{{job.job_time}}</div>
      <div class="job_class">简介：{{job.intro}}</div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api'
  import config from '../../api/config'
  import dropdown from '../components/dropdown'

  export default {
    components: {
      dropdown: dropdown
    },
    data () {
      return {
        closeCode: '关闭',
        articlesId: '',
        loading: false,
        modal1: false,
        job: {},
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
            title: '兼职id',
            align: 'center',
            key: 'id'
          },
          {
            title: '兼职名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '报名时间',
            align: 'center',
            key: 'created_at'
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
                      this.modal1 = true
                      this.job = params.row.job
                    }
                  }
                }, '查看兼职')
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
      jobDetail () {
        this.$Message.error('等我一下')
      },
      handlePage (num) {
        this.recommend(num)
      },
      shieldUser () {
        let data = {}
        if (this.closeCode === '关闭') {
          data = {is_shielded: '0'}
        } else {
          data = {is_shielded: '1'}
        }
        console.log(this.closeCode)
        uAxios.put(`admin/shield/users/${this.id}`, data)
          .then(res => {
            let {code} = res.data
            if(code === 0) this.$Message.success('设置成功')
          })
      },
      showModal (item, type) {
        this.modal = true
        this.message.title_v = '预览'
        this.message.type_v = 'image'
        this.message.image = item ? item : 'http://images.ufutx.com/201905/13/599151d27fc07ba1bc4cc57a291525e5.jpeg'
      },
      recommend (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/users/${self.id}/applycations?page=${page}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.recommendData = result.data.map((item) => {
              return {
                id: item.id,
                name: item.job.title,
                created_at: item.created_at,
                job: item.job
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
            if (result.is_shielded === 0) {
              this.closeCode = '关闭'
            } else {
              this.closeCode = '开启'
            }
            console.log(result)
            self.name = result.name
            self.avatar = result.avatar
            self.mobile = result.mobile
            self.information = [
              {
                name: 'id',
                key: result.id
              },
              {
                name: '手机号',
                key: result.mobile
              },
              {
                name: '性别',
                key: result.sex == '1' ? '男' : '女'
              },
              {
                name: '出生日期',
                key: result.birthday
              },
              {
                name: '地址',
                key: `${result.dist==null?'未知':result.city + '-' + result.dist}`
              },
              {
                name: '学历',
                key: result.ducation
              },
              {
                name: '毕业学校',
                key: result.school
              },
              {
                name: '工作类型',
                key: result.pay_type == 'DAILY' ? '日结' : '月结'
              },
              {
                name: '活动类型',
                key: result.work_sort
              },
              {
                name: '加入时间',
                key: result.created_at
              }
            ]
            self.orgTotal = result.total
            self.loading = false
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

<style lang="less" scoped>
  ._bold {
    font-weight: bold
  }
  .job_class{
    margin: 8px 0;
  }
</style>
