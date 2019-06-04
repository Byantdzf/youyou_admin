<template>
  <div class="hello">
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: #ff6c4c;">群发详情</p>
      <Row>
        <Col span="15" style="min-height: 60vh">
          <Card style="overflow: hidden;">
            <div class="bc_box">
              <div class="font_16 _bold bc_title">发送内容：</div>
              <Input placeholder="Enter something..." class="bc_input" type="textarea" v-model="content"/>
            </div>
            <!--<div class="bc_box">-->
            <!--<div class="font_16 _bold bc_title">-->
            <!--接收成员：-->
            <!--<div-->
            <!--style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin: 6px 0;">-->
            <!--<Checkbox-->
            <!--:indeterminate="indeterminate"-->
            <!--:value="checkAll"-->
            <!--@click.prevent.native="handleCheckAll">全选-->
            <!--</Checkbox>-->
            <!--</div>-->
            <!--<CheckboxGroup v-model="FilterType" @on-change="checkAllGroupChange">-->
            <!--<Checkbox :label="item" v-for="item,index in this.labels"></Checkbox>-->
            <!--</CheckboxGroup>-->
            <!--</div>-->
            <!--</div>-->
            <div style="margin: 22px 12px;">
              <span class="_bold"> 搜索用户：</span>
              <Select v-model="PayID" style="width: 300px;" filterable @on-query-change="getGropData" clearable
                      ref="store">
                <Option v-for="item in userList" :value="item.id" :key="item.id" @ @click.native="changGropData(item)">
                  {{ item.name }}
                </Option>
              </Select>
              <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;margin-top: 22px;"
                     border></Table>
              <!--<Page :total="orgTotal" @on-change="handlePage" :page-size="15"-->
              <!--style="float:right;margin: 12px;"></Page>-->
            </div>
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
                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin: 6px 0;">
                  <span v-for="item,index in this.information">{{item.name}}、</span>
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
        loading: false,
        searchKeyword: '',
        orgTotal: 1,
        indeterminate: false,
        checkAll: false, // 全选
        PayID: '',
        userList: [], // 用户列表
        content: '',
        labels: ['vip', '实名认证', '单身', '介绍人', '男', '女',],
        FilterType: [],
        typeList: [],
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
        messages: {},
        loading: false
      }
    },
    watch: {
      FilterType () {
        console.log(this.FilterType)
      }
    },
    methods: {
      changGropData (item) {
        this.FilterType = []
        this.checkAll = false
        this.indeterminate = false
        if (this.information > 14) {
          return this.$Message.error('群发指定人暂且支持15人')
        }
        this.information.push(item)
        let hash = {}
        this.information = this.information.reduce((preVal, curVal) => {
          hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal)
          return preVal
        }, [])
        this.list = this.information
        this.$refs.store.clearSingleSelect()
      },
      getGropData (value) {
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
      sendMessages () {
        let ids = [],
          data
        for (let item of this.information) {
          ids.push(item.id)
        }
        if(!this.content) {return this.$Message.error('请填写发送信息')}
        if(this.information.length < 1) {return this.$Message.error('请添加接收信息的成员')}
        data = {content: this.content, user_ids: ids}
        console.log(data)
        uAxios.post(`admin/send/assistant/message`, data)
          .then(res => {
            let {code} = res.data
            if(code === 0) {
              this.$Message.success('发送成功！')
              this.list = this.information = []
              this.content = ''
            }
          }).catch((res)=>{
            console.log(res)
        })
      },
      handleSearch () {
        this.getlist()
      },
      handlePage (num) {
        this.getlist(num)
      },
      handleCheckAll () {
        this.information = []
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false
        if (this.checkAll) {
          this.FilterType = this.labels
        } else {
          this.FilterType = []
          this.information = this.list
        }
      },
      checkAllGroupChange (data) {
        this.information = []
        if (data.length === this.labels.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
          this.information = this.list
        }
      },
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
