<template>
  <div class="hello">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane :label='title' name="paasDetail">
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
                <Input v-model="paasDetail.intro" placeholder="Enter paasDetail intro" type="textarea"
                       :autosize="{minRows: 2,maxRows: 5}"></Input>
              </Row>
            </FormItem>
          </Form>
          <div style="text-align: center">
            <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
          </div>
        </TabPane>
        <TabPane label='平台渠道' name="paasPlatform" v-if="id != 0">
          <Table :loading="loading" :columns="columns" :data="paasInformation" style="width: 100%;" border></Table>
          <Page :total="total" @on-change="handlePage" :page-size="15"
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
        disabled: false,
        user_is_admin: 0,
        date: [],
        title: '平台详情',
        BtnText: '保存修改',
        loading: false,
        columns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center',
            width: 80,
            editable: true
          },
          {
            title: '名字',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: 'logo',
            key: 'logo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.logo
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
                  }
                }
              })
            },
            width: 80,
            align: 'center'
          },
          {
            title: 'app_id',
            key: 'app_id',
            align: 'center',
          },
          {
            title: 'paas_id',
            key: 'paas_id',
            align: 'center',
          },
          {
            title: '创建时间',
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
                    type: 'primary'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确认对话框标题',
                        content: ` <Input  placeholder="请输入..." style="width: 300px"></Input>`,
                        onOk: () => {
                          this.$Message.info('点击了确定');
                        },
                        onCancel: () => {
                          this.$Message.info('点击了取消');
                        }
                      });
                    }
                  }
                }, '修改名字')
              ])
            }
          }
        ],
        information: [],
        paasInformation: [],
        searchKeyword: '',
        activeTab: 'paasDetail',
        orgColumns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center',
            width: 80,
            editable: true
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: '头像',
            key: 'photo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.photo
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
            title: '性别',
            key: 'sex',
            align: 'center',
            editable: true
          },
          {
            title: '单身状态',
            key: 'type',
            align: 'center',
            editable: true
          },
          {
            title: '加入时间',
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
                    type: 'primary'
                  },
                  style: {
                    margin: '5px'
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
                }, '用户详情')
              ])
            }
          }
        ],
        orgData: [],
        total: 0,
        orgTotal: 0,
        uploaddata: [],
        id: 0,
        //平台详情
        paasDetail: {}
      }
    },
    methods: {
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        switch (type) {
          case 'paasDetail':
            this.getlist(1)
            break
          case 'paasPlatform':
            this.getPlatforms(1)
            break
          default:
            this.getWorkers(1)
        }
      },
      settNote () {
        let argu = {id: this.id}
        this.$router.push({
          name: 'user_note',
          params: argu
        })
      },
      uploadPicture (image) {  // 单
        this.paasDetail.poster = image // 轮播banna
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
      getWorkers (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/paas/${self.id}/workers?page=` + page + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            self.information = result.data.map((item) => {
              let {user} = item
              user.created_at = item.created_at
              user.sex = user.sex == 1 ? '男' : '女'
              user.type = user.type == 'single'? '单身': '介绍人'
              return user
            })
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
      getPlatforms (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/paas/${self.id}/platforms?page=` + page + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            self.paasInformation = result.data
            self.total = result.total
            self.loading = false
          })
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get('admin/paas/' + self.id)
          .then(res => {
            let result = res.data.data
            this.paasDetail = result
            console.log(this.paasDetail)
          })
      },
      handlePage (num) {
        // 分页
        switch (this.activeTab) {
          case 'paasPlatform':
            this.getPlatforms(num)
            break
          default:
            this.getWorkers(1)
        }
      }
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
</style>
