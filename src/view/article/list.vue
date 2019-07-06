<style lang="less" scoped>
</style>
<template>
  <div id="name">
    <div v-model="activeTab">
      <Card>
        <Tabs @on-click="getTab">
          <TabPane label="文章列表" name="search">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <span @click="creatPaas">
                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建文章</Button>
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script>
  import uAxios from '../../api/index'

  export default {
    components: {},
    data () {
      return {
        id: 2134,
        searchKeyword: '',
        loading: false,
        switchLoading: false,
        activeTab: 'signIn',
        orgTotal: 0,
        Columns: [
          {
            title: '文章ID',
            align: 'center',
            width: 80,
            key: 'id'
          },
          {
            title: '标题',
            align: 'center',
            key: 'title'
          },
          {
            title: '子标题',
            align: 'center',
            key: 'sub_title'
          },
          {
            title: '文章图片',
            key: 'logo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.pic
                },
                style: {
                  height: '48px',
                  marginTop: '6px',
                  padding: '4px',
                  borderRadius: '4px',
                  border: '1px solid #f4f4f4'
                },
                on: {
                  click: () => {
                  }
                }
              })
            },
            align: 'center'
          },
          // {
          //   title: '文章简介',
          //   align: 'center',
          //   key: 'content'
          // },
          {
            title: '创建时间',
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
                    type: 'primary'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {id: params.row.id}
                      this.$router.push({
                        name: 'articleDetail',
                        params: argu
                      })
                    }
                  }
                }, '文章详情'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteArticle(params.row.id, params.index)
                    }
                  }
                }, '删除文章')
              ])
            }
          }
        ],
        information: [],
      }
    },
    methods: {
      handlePage (num) { // 分页
        this.currentPage = num
          this.getlist(num)
      },
      deleteArticle (id) { // 删除文章
        this.$Modal.confirm({
          title: '系统提示',
          content: '<p>是否确认删除？</p>',
          onOk: () => {
            uAxios.delete(`admin/articles/${id}`).then(response => {
              if (response.data.code === 0) {
                this.$Message.success('删除成功!')
                this.getlist(1)
              } else {
                alert('操作失败！')
              }
            })
          }
        })
      },
      handleSearch () {
        this.getlist(1)
      },
      creatPaas () {
        let argu = {id: 0}
        this.$router.push({
          name: 'articleDetail',
          params: argu
        })
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
      },
      getlist (page) {
        let self = this,
          jump = ''
        self.loading = true
        uAxios.get('admin/articles?page=' + page + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            self.total = res.data.total
            self.information = result.data
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
          .catch(() => {
            self.loading = false
          })
      },
    },
    mounted () {
      this.getlist(1)
    }
  }
</script>
