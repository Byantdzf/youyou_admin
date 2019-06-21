<template>
  <div class="hello">
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: #ff6c4c;">编辑信息</p>
      <Row>
        <Col span="15" style="min-height: 60vh">
          <Card title="发送内容" icon="md-mail">
            <Input placeholder="Enter something..." class="bc_input" type="textarea" v-model="content"/>
          </Card>
          <Card title="批量发送" icon="ios-people" style="margin: 16px 0;">
            <CheckboxGroup v-model="FilterType" @on-change="checkAllGroupChange"
                           style="padding-bottom: 6px;margin-bottom:6px; border-bottom: 1px solid #d3d3d3">
              <Checkbox label="全部成员"></Checkbox>
            </CheckboxGroup>
            <CheckboxGroup v-model="FilterType" @on-change="checkGroupChange">
              <Checkbox :label="item" v-for="item,index in this.labels"></Checkbox>
            </CheckboxGroup>
          </Card>
          <Card title="逐个发送" icon="md-person">
            <span class="_bold"> 搜索用户：</span>
            <Select v-model="userID" style="width: 300px;" filterable @on-query-change="getGropData" clearable
                    ref="store">
              <Option v-for="item in userList" :value="item.id" :key="item.id" @click.native="changGropData(item)">
                {{ item.name }}
              </Option>
            </Select>
            <!--<span @click="getGropData">-->
                    <!--<Button type="primary" icon="ios-search" style="margin-left: 12px;">搜索</Button>-->
                <!--</span>-->
            <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;margin-top: 22px;"
                   border></Table>
            <!--<Page :total="orgTotal" @on-change="handlePage" :page-size="15"-->
            <!--style="float:right;margin: 12px;"></Page>-->
          </Card>
        </Col>
        <Col span="8" offset="1" style="min-height: 60vh">
          <Card style="overflow: hidden;">
            <div class="bc_box">
              <div class="font_16 _bold bc_title">发送内容：</div>
              <Input placeholder="Enter something..." class="bc_input" type="textarea" v-model="content"/>
            </div>
            <div class="bc_box">
              <div class="font_16 bc_title">
                <span class="_bold">接收成员：</span>
                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin: 6px 0;color: #ff0517;"
                     class="_bold">
                  <div v-if="FilterType.length>0">
                    <span v-for="item,index in this.FilterType">{{item}}、</span>
                  </div>
                  <div v-else>
                    <span v-for="item,index in this.information">{{item.name}}、</span>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin: 22px auto;text-align: center;">
              <Button type="primary" icon="ios-chatbubbles-outline" @click="sendMessages">发送</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'

  export default {
    name: 'createMassText',
    components: {
      dropdown: dropdown,
      uploadImage: uploadImage,
      informPic: uploadImage
    },
    data () {
      return {
        orgTotal: 1,
        userID: '',
        userList: [], // 用户列表
        content: '',  // 信息内容
        labels: ['vip', '实名认证', '单身', '介绍人', '男', '女'],
        FilterType: [],
        orgColumns: [
          {
            title: '用户ID',
            align: 'center',
            width: 80,
            key: 'id'
          },
          {
            title: '用户',
            key: 'name',
            align: 'center'
          },
          {
            title: '反馈人头像',
            key: 'avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.avatar
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
            title: '用户类型',
            key: 'type',
            render: (h, params) => {
              let text
              switch (params.row.type) {
                case 'single':
                  text = '单身'
                  break
                case 'marriage':
                  text = '介绍人'
                  break
                default :
                  text = '恋爱'
              }
              return h('span', text)
            },
            align: 'center'
          },
          {
            title: '联系方式',
            key: 'mobile',
            align: 'center'
          },
          {
            title: '操作',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  on: {
                    click: () => {
                      console.log(params.index)
                      this.information.splice(params.index, 1)
                    }
                  }
                }, '移除')
              ])
            }
          }
        ],
        information: [],
        sendTypes: {
          type: '',
          is_approved: '',
          user_rank: '',
          user_sex: '',
          user_type: ''
        },
        loading: false
      }
    },
    watch: {
      FilterType () {
        console.log(this.FilterType)
        if (this.FilterType.includes('实名认证')) {
          this.sendTypes.is_approved = 1
        } else {
          this.sendTypes.is_approved = ''
        }
        if (this.FilterType.includes('vip')) {
          this.sendTypes.user_rank = 1
        } else {
          this.sendTypes.user_rank = ''
        }
        if (this.FilterType.includes('男')) {
          this.sendTypes.user_sex = 1
        } else if (this.FilterType.includes('女')) {
          this.sendTypes.user_sex = 2
        } else if (this.FilterType.includes('女') && this.FilterType.includes('男')) {
          this.sendTypes.user_sex = ''
        }

        if (this.FilterType.includes('女') && this.FilterType.includes('男')) {
          this.sendTypes.user_sex = 'ALL'
        }

        if (this.FilterType.includes('单身')) {
          this.sendTypes.user_type = 'single'
        } else if (this.FilterType.includes('介绍人')) {
          this.sendTypes.user_type = 'marriage'
        } else {
          this.sendTypes.user_type = ''
        }
        if (this.FilterType.includes('单身') && this.FilterType.includes('介绍人')) {
          this.sendTypes.user_type = 'ALL'
        }


        if (this.FilterType.includes('全部成员')) {
          this.sendTypes.type = 'ALL'
        } else {
          this.sendTypes.type = ''
        }
        console.log(this.sendTypes)
      }
    },
    methods: {
      changGropData (item) {
        this.FilterType = [] // 清理批量
        if (this.information > 14) {
          return this.$Message.error('群发指定人暂且支持15人')
        }
        this.information.push(item)
        let hash = {}
        this.information = this.information.reduce((preVal, curVal) => { // 过滤数组
          hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal)
          return preVal
        }, [])
        this.list = this.information // 存贮数组
        this.$refs.store.clearSingleSelect() // 清空列表
      },
      checkAllGroupChange (data) { // 全部复选框
        data.map((item, index) => {
          if (item == '全部成员') {
            this.FilterType.splice(0, index)
          }
        })
      },
      checkGroupChange (data) { // 批量复选框
        data.map((item, index) => {
          if (item == '全部成员') {
            this.FilterType.splice(index, 1)
          }
        })
        this.information = []
        if (!this.FilterType.length) {
          this.information = this.list
        }
      },
      getGropData (value) { // 搜索用户
        let self = this
        const msg = self.$Message.loading('正在加载中...')
        uAxios.get(`admin/users?keyword=${value}`)
          .then(res => {
            setTimeout(msg, 3000)
            self.loading = false
            let result = res.data.data.data
            this.userList = result.map((item) => {
              return {
                name: item.name,
                id: item.id,
                avatar: item.avatar,
                mobile: item.mobile,
                type: item.type
              }
            })
          })
          .catch(error => {
            self.loading = false
          })
      },
      sendMessages () { // 发送
        let ids = [],
          data
        for (let item of this.information) {
          ids.push(item.id)
        }
        if (!this.content) {
          return this.$Message.error('请填写发送信息')
        }
        if (this.information.length > 0) {
          data = {content: this.content, user_ids: ids}
        } else {
          data = {content: this.content, ...this.sendTypes}
        }
        console.log(data)
        uAxios.post(`admin/send/assistant/message`, data)
          .then(res => {
            let {code} = res.data
            if (code === 0) {
              this.$Message.success('发送成功！')
              this.list = this.information = []
              this.content = ''
            }
          }).catch((res) => {
          console.log(res)
        })
      },
      handleSearch () {
        this.getlist()
      },
      handlePage (num) {
        this.getlist(num)
      }
    },
    mounted () {
      this.getGropData(1)
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }

  .bc_box {
    width: 100%;
    border-bottom: 1px solid #ececec;
    padding: 12px;
    overflow: hidden;

    .bc_input {
      /*float: right;*/
      max-width: 72%;
    }

    .bc_title {
      margin-top: 6px;
      float: left;
    }

  }
</style>
