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
      <Tabs @on-click="getTab">
        <TabPane label="婚恋活动" name="search">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 200px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                        <Button type="primary" icon="search" style=" margin-bottom: 22px;">搜索</Button>
                    </span>
          <span @click="creatParty">
                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建活动</Button>
                    </span>
          <Card>
            <p slot="title" style="color: #ff6c4c ">
              活动列表
            </p>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    name: 'activityList',
    components: {},
    data () {
      return {
        id: 2134,
        searchKeyword: '',
        loading: false,
        activeTab: 'signIn',
        orgTotal: 0,
        Columns: [
          {
            title: '活动ID',
            align: 'center',
            width: 80,
            key: 'id'
          },
          {
            title: '名称',
            align: 'center',
            key: 'theme'
          },
          {
            title: '举办方',
            align: 'center',
            key: 'host'
          },
          {
            title: '活动海报',
            key: 'poster',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.poster
                },
                style: {
                  height: '48px',
                  marginTop: '6px',
                  border: '4px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    // let argu = {user_detail_id: params.row.id};
                    // this.$router.push({
                    //     name: 'activity',
                    //     params: argu
                    // });
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '活动地址',
            align: 'center',
            key: 'address'
          },
          {
            title: '活动价钱',
            align: 'center',
            key: 'fee'
          },
          {
            title: '开始时间',
            align: 'center',
            width: 100,
            key: 'start_time'
          },
          {
            title: '结束时间',
            align: 'center',
            width: 100,
            key: 'end_time'
          },
          {
            title: '是否置顶',
            align: 'center',
            width: 100,
            key: 'is_top',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.is_top > 0,
                },
                on: {
                  'on-change': (value) => {
                    this.switchFn(value, params.row.id)
                  }
                }
              })
            }
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
                      let argu = {activity_id: params.row.id}
                      this.$router.push({
                        name: 'activity',
                        params: argu
                      })
                    }
                  }
                }, '活动详情'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {activity_detail_id: params.row.id}
                      this.$router.push({
                        name: 'activity_detail',
                        params: argu
                      })
                    }
                  }
                }, '活动现场')
              ])
            }
          }
        ],
        information: [],
      }
    },
    methods: {
      switchFn (val, id) {
        switch (val) {
          case true: {
            uAxios.put(`admin/activity/${id}/top`, this.activity).then(response => {
              if (response.data.code === 0) {
                this.$Message.success('设置成功!')
              } else {
                alert('操作失败！')
              }
            })
          }
            break
          default: {
            uAxios.put(`admin/activity/${id}/cancel/top`, this.activity).then(response => {
              if (response.data.code === 0) {
                this.$Message.success('设置成功!')
              } else {
                alert('操作失败！')
              }
            })
          }
        }
      },
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
      creatParty () {
        let argu = {activity_id: 0}
        this.$router.push({
          name: 'activity',
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
        uAxios.get('admin/activities?page=' + page + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            self.total = res.data.data.total
            self.information = result.data
            // for (let item of self.information){
            //     item.address = item.province + item.city + item.dist + item.address;
            // }
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
    },
    mounted () {
      this.getlist(1)
    }
  }
</script>
