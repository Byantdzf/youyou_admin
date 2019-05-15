<template>
  <div class="hello">
    <Card>
      <Tabs @on-click="getTab">
        <TabPane :label='title' name="paasDetail">
          <Row style="padding: 12px;">
            <i-col :span="id == 0?'24':'11'">
              <Card :bordered="true">
                <Form ref="paasDetail" :model="paasDetail" :label-width="100">
                  <FormItem label="平台logo" prop="image">
                    <Card>
                      <uploadImage v-on:uploadPictures="uploadPicture" :pic="paasDetail.logo"></uploadImage>
                    </Card>
                  </FormItem>
                  <FormItem label="平台名称" prop="name">
                    <Input v-if="id != 0" v-model="paasDetail.name" placeholder="Enter paasDetail name"
                           readonly="readonly"></Input>
                    <Input v-else v-model="paasDetail.name" placeholder="Enter paasDetail name"></Input>
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
              </Card>
            </i-col>
            <i-col span="11" offset="2" v-if="id != 0">
              <Card :bordered="true">
                <Form ref="paasDetail" :model="paasDetail" :label-width="100">
                  <FormItem label="logo" prop="image">
                    <Card>
                      <uploadImage v-on:uploadPictures="uploadLogo" :pic="platform.logo"></uploadImage>
                    </Card>
                  </FormItem>
                  <FormItem label="名称" prop="name">
                    <Input v-model="platform.name" placeholder="Enter paasDetail name"></Input>
                  </FormItem>
                  <FormItem label="app_id" prop="app_id">
                    <Row>
                      <Input v-model="platform.app_id" placeholder="Enter paasDetail title"></Input>
                    </Row>
                  </FormItem>
                </Form>
                <div style="text-align: center">
                  <Button type="primary" @click="editPlatform">新建渠道</Button>
                </div>
              </Card>
            </i-col>
          </Row>
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
      <!--activeTab: 'paasDetail',-->
      <Card style="margin: 12px;" v-if="activeTab == 'paasDetail' && id != 0">
        <Tabs style="margin-top: 12px;">
          <TabPane label="添加同工">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch(1)"
              placeholder="关键字搜索..."
              style="width: 160px; margin-bottom: 22px;"/>
            <span @click="handleSearch(1)">
                    <Button type="primary" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;">搜索</Button>
                </span>
            <Table :columns="workerColumns" :data="addInformation" style="width: 100%;" border></Table>
            <Page :total="workerTotal" @on-change="workerPage" :page-size="15"
                  style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
          </TabPane>
        </Tabs>
      </Card>
    </Card>
    <Modal
      v-model="modalInput"
      title="修改名字"
      @on-ok="ok">
      <i-input placeholder="输入要修改的名字" v-model="paasName"></i-input>
    </Modal>
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
        paasName: '',
        platform: {},
        modalInput: false,
        title: '平台详情',
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
                }, '修改名字')
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
        //平台详情
        paasDetail: {}
      }
    },
    methods: {
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
        this.paasDetail.logo = image // 轮播banna
      },
      uploadLogo (image) {  // 单
        this.platform.logo = image // 轮播banna
      },
      // 提交表单
      handleSubmit () {
        console.log(this.paasDetail)
        if (!this.paasDetail.logo) return this.$Message.error('缺少logo图!')
        if (!this.paasDetail.name) return this.$Message.error('缺少名称!')
        if (!this.paasDetail.title) return this.$Message.error('缺少标题!')
        if (!this.paasDetail.intro) return this.$Message.error('缺少简介!')
        if (this.id == 0) {
          uAxios.post(`admin/paas`, this.paasDetail).then(response => {
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
        console.log(this.paasDetail)
        uAxios.put(`admin/paas/${this.id}`, this.paasDetail).then(response => {
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
        uAxios.get('admin/paas/' + self.id)
          .then(res => {
            let result = res.data.data
            this.paasDetail = result
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
