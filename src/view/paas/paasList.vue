<style lang="less" scoped>
  .line-chart-con {
    height: 300px;
  }

  .ivu-card-body {
    text-align: center;
  }

  ._bc-list {
    box-shadow: 0 0 12px #d3d3d3;
    margin-bottom: 12px;
    padding: 12px;
    position: relative;
  }

  ._bc-num {
    font-size: 42px;
    font-weight: bold;
    position: absolute;
    right: 6%;
    top: 40%;
  }

  .bc-style {
    width: 54px;
    position: absolute;
    right: 2%;
    top: 2%;
  }

  .float_l {
    float: left;
  }

  ._bc-name {
    font-size: 16px;
    margin-left: 12px;
    font-weight: bold;

  }
</style>
<template>
  <div id="name">
    <div v-model="activeTab">
      <Card>
        <Tabs @on-click="getTab">
          <TabPane label="平台管理" name="search">
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
                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建平台</Button>
                    </span>
            <Card>
              <p slot="title" style="color: #ff6c4c ">平台列表</p>
              <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
              <div style="clear: both"></div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script>
  import uAxios from '../../api/index'

  export default {
    name: 'paasList',
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
            title: '平台ID',
            align: 'center',
            width: 80,
            key: 'id'
          },
          {
            title: '平台名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '平台标题',
            align: 'center',
            key: 'title'
          },
          {
            title: '平台logo',
            key: 'logo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.logo
                },
                style: {
                  height: '48px',
                  marginTop: '6px',
                  border: '4px solid #f4f4f4'
                },
                on: {
                  click: () => {
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '平台简介',
            align: 'center',
            key: 'intro'
          },
          {
            title: '创建时间',
            align: 'center',
            width: 100,
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
                        name: 'paasDetail',
                        params: argu
                      })
                    }
                  }
                }, '平台详情')
              ])
            }
          }
        ],
        information: [],
      }
    },
    methods: {
      handlePage (num) {
        // 分页
        this.currentPage = num
        if (this.social.length == 0) {
          this.getlist(num)
        } else {
          this.filterLabel(num)
        }

      },
      handleSearch () {
        this.getlist(1)
      },
      creatPaas () {
        let argu = {id: 0}
        this.$router.push({
          name: 'paasDetail',
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
        uAxios.get('admin/paas/list?page=' + page + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            self.total = res.data.total
            self.information = result
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
