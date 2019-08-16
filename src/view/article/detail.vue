<template>
  <div class="hello">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane :label='title' name="paasDetail">
          <!--<Row style="padding: 12px;">-->
            <!--<i-col :span="id == 0?'24':'11'">-->
              <!--<Card :bordered="true">-->
                <Form ref="paasDetail" :model="paasDetail" :label-width="100">
                  <FormItem label="文章图片" prop="image">
                    <Card style="max-width: 360px;">
                      <uploadImage v-on:uploadPictures="uploadPicture" :pic="paasDetail.pic"></uploadImage>
                    </Card>
                  </FormItem>
                  <FormItem label="文章标题" prop="name">
                    <Input v-model="paasDetail.title" placeholder="Enter paasDetail title" style="max-width: 360px;"></Input>
                  </FormItem>
                  <FormItem label="文章副标题" prop="name">
                    <Input v-model="paasDetail.sub_title" placeholder="Enter paasDetail sub_title" style="max-width: 360px;"></Input>
                  </FormItem>
                  <FormItem label="文章类型" prop="name">
                    <RadioGroup v-model="paasDetail.type">
                      <Radio label="OF">公众号</Radio>
                      <Radio label="H5">自定义</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="文章链接" prop="name" v-show="paasDetail.type == 'OF'">
                    <Input v-model="paasDetail.path" placeholder="Enter paasDetail sub_title" style="max-width: 360px;"></Input>
                  </FormItem>
                  <FormItem label="文章内容" prop="name" v-show="paasDetail.type == 'H5'">
                    <editor ref="editor" :value="content" @on-change="handleChange"/>
                  </FormItem>
                </Form>
                <div style="text-align: center">
                  <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
                </div>
              <!--</Card>-->
            <!--</i-col>-->
          <!--</Row>-->
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      v-model="modal"
      title="小程序码"
      no-cancel>
      <div style="font-size: 16px">
        <div style="text-align: center">
          <img :src="appletImage" style="width: 400px;" v-if="appletImage"/>
          <p v-else>暂无小程序预览图</p>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="modalInput"
      title="修改名字"
      @on-ok="ok">
      <i-input placeholder="输入要修改的名字" v-model="paasName"></i-input>
    </Modal>
    <Modal
      v-model="modalchannel"
      title="新建渠道"
      @on-ok="editPlatform">
        <Card :bordered="true">
          <Form ref="paasDetail" :model="paasDetail" :label-width="100">
            <FormItem label="名称" prop="name">
              <Input v-model="platform.name" placeholder="Enter paasDetail name"></Input>
            </FormItem>
            <FormItem label="app_id" prop="app_id">
              <Row>
                <Input v-model="platform.app_id" placeholder="Enter paasDetail title"></Input>
              </Row>
            </FormItem>
          </Form>
        </Card>
    </Modal>
  </div>
</template>

<script>
import uAxios from '../../api/index'
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
    Editor
  },
  data () {
    return {
      content: '',
      disabled: false,
      user_is_admin: 0,
      date: [],
      paasName: '',
      platform: {},
      modalchannel: false,
      modalInput: false,
      modal: false,
      appletImage: '',
      title: '文章管理',
      BtnText: '保存修改',
      paasIndex: 0,
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
          title: '小程序码',
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
                  this.modal = true
                  this.appletImage = params.row.logo
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
          key: 'id',
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
                    this.paas_id = params.row.id
                    this.modalInput = true
                    this.paasIndex = params.index
                    this.paasName = params.row.name
                  }
                }
              }, '修改名字'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.modal = true
                    this.appletImage = params.row.logo
                  }
                }
              }, '小程序码')
            ])
          }
        }
      ],
      paas_id: '',
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
              }, '用户详情'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>是否确认将 <span class="_bold">${params.row.name}</span> 移除同工列表？</p>`,
                      onOk: () => {
                        this.delWorker(params.row.delId, params.index)
                      },
                      onCancel: () => {
                        this.$Message.info('点击了取消')
                      }
                    })
                  }
                }
              }, '删除同工')
            ])
          }
        }
      ],
      workerColumns: [
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
                    this.$Modal.confirm({
                      title: '温馨提示',
                      content: `<p>是否确认添加 <span class="_bold">${params.row.name}</span> 为同工</p>`,
                      onOk: () => {
                        this.addWorker(params.row.id)
                      },
                      onCancel: () => {
                        this.$Message.info('点击了取消')
                      }
                    })
                  }
                }
              }, '添加为同工')
            ])
          }
        }
      ],
      addInformation: [],
      total: 0,
      orgTotal: 0,
      workerTotal: 0,
      uploaddata: [],
      id: 0,
      //平台管理
      paasDetail: {}
    }
  },
  methods: {
    handleChange (html, text) {
      this.paasDetail.content = html
      console.log(this.paasDetail)
    },
    changeContent () {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    },
    channel () {
      this.modalchannel = true
    },
    editPlatform () { // 新建平台
      console.log(this.platform)
      this.platform.paas_id = this.id
      uAxios.post(`admin/platform`, this.platform).then(response => {
        if (response.data.code === 0) {
          this.$Message.success('创建成功!')
          this.platform = {}
        } else {
          alert('操作失败！')
        }
      })
    },
    addWorker (id) {
      let data = {
        user_id: id,
        paas_id: this.id
      }
      uAxios.post(`admin/paas/worker`, data)
        .then(response => {
          if (response.data.code === 0) {
            this.$Message.success('添加成功!')
          } else {
            alert('操作失败！')
          }
        }).catch(() => {
        this.loading = false
      })
    },
    delWorker (id, index) {
      uAxios.delete(`admin/paas/worker/${id}`)
        .then(response => {
          if (response.data.code === 0) {
            this.information.splice(index,1)
            this.$Message.success('删除成功!')
          } else {
            alert('操作失败！')
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSearch (page) {
      let self = this
      this.$Message.loading({
        content: '加载中...',
        duration: 1,
        onClose: () => {
        }
      })
      self.loading = true
      uAxios.get(`admin/users?page=${page}&keyword=${self.searchKeyword}`)
        .then(res => {
          let result = res.data.data
          if (result.data) {
            self.addInformation = result.data
            self.workerTotal = result.total
          }
          self.loading = false
        }).catch(() => {
        self.loading = false
      })
    },
    ok () {
      this.$Message.loading({
        content: '修改中...',
        duration: 1,
        onClose: () => {
          console.log(this.paasName)
          console.log(this.paas_id)
          let data = {
            name: this.paasName
          }
          uAxios.put(`admin/platform/${this.paas_id}`, data).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('修改成功!')
              this.paasInformation[this.paasIndex].name = this.paasName
              console.log(this.paasInformation)
              this.paasName = ''
            } else {
              alert('操作失败！')
            }
          })
        }
      })
    },
    getTab (type) {
      // 获得激活的Tab页
      this.activeTab = type
      switch (type) {
        case 'paasDetail':
          this.getlist(1)
          break
        // case 'paasUser':
        //   this.getlist(1)
        //   break
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
      this.paasDetail.pic = image // 轮播banna
    },
    // 提交表单
    handleSubmit () {
      console.log(this.paasDetail)
      if (!this.paasDetail.pic) return this.$Message.error('缺少图片!')
      if (!this.paasDetail.title) return this.$Message.error('缺少标题!')
      if (!this.paasDetail.sub_title) return this.$Message.error('缺少副标题!')
      if (this.id == 0) {
        uAxios.post(`admin/articles`, this.paasDetail).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('创建成功!')
            setTimeout(() => {
              this.$router.push({
                name: 'article'
              })
            }, 800)
          } else {
            alert('操作失败！')
          }
        })
        console.log(this.paasDetail)
        return
      }
      console.log(this.paasDetail)
      uAxios.put(`admin/articles/${this.id}`, this.paasDetail).then(response => {
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
            user.delId = item.id
            user.created_at = item.created_at
            user.sex = user.sex == 1 ? '男' : '女'
            user.type = user.type == 'single' ? '单身' : '介绍人'
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
      uAxios.get('admin/articles/' + self.id)
        .then(res => {
          let result = res.data.data
          this.paasDetail = result
          this.$refs.editor.setHtml(result.content)
          console.log(this.paasDetail)
        })
    },
    workerPage (num) {
      this.handleSearch(num)
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
    this.$refs.editor.setHtml('')
    if (this.$route.params.id != 0) {
      this.id = this.$route.params.id
      this.getlist()
      return
    }
    this.title = this.BtnText = '创建文章'
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
