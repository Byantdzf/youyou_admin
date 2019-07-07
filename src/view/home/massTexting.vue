<template>
  <div class="hello">
    <Card style="margin-top: 18px;overflow: hidden;">
      <p slot="title" style="color: none;">小助手信息</p>
      <Input
        v-model="searchKeyword"
        @on-enter="handleSearch"
        placeholder="关键字搜索..."
        style="width: 200px; margin-bottom: 22px;"/>
      <span @click="handleSearch">
        <Button type="primary" icon="ios-search" style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
      </span>
      <router-link :to="{ name: 'createMassText'}" >
        <Button type="primary" icon="md-add" style="float: right;margin-right: 22px;">群发消息</Button>
      </router-link>
      <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
      <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
            style="float:right;margin: 12px;"></Page>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api'

  export default {
    name: 'massTexting',
    components: {},
    data () {
      return {
        searchKeyword: '',
        loading: false,
        orgTotal: 0,
        orgColumns: [
          {
            title: '群发ID',
            width: 80,
            key: 'id',
            align: 'center',
          },
          {
            title: '群发时间',
            align: 'center',
            key: 'created_at'
          },
          {
            title: '群发信息',
            key: 'content',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.content,
                  readonly: true
                },
                on: {
                  'on-blur': (event) => {
                  }
                }
              })
            }
          },
          {
            title: '群发用户',
            key: 'user_names',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.user_names,
                  readonly: true
                },
                on: {
                  'on-blur': (event) => {
                  }
                }
              })
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  on: {
                    click: () => {
                      let argu = {id: params.row.id}
                      this.$router.push({
                        name: 'messageDetail',
                        params: argu
                      })
                    }
                  }
                }, '查看详情')
              ])
            }
          }
        ],
        information: []
      }
    },
    methods: {
      handlePage (num) {
        this.getlist(num)
      },
      handleSearch () {
        this.getlist()
      },
      getlist (page = 1) {
        let self = this
        uAxios.get(`admin/assistant/messages?page=${page}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            self.information = result.data.map((item, index) => {
              return {
                id: item.id,
                content: item.content,
                created_at: item.created_at,
                user_names: item.type === 'ALL' ? '全部' : item.user_names.join(',')
              }
            })
            self.orgTotal = result.total
          })
      }
    },
    mounted () {
      this.getlist()
    }
  }
</script>

<style>
  ._bold {
    font-weight: bold
  }
</style>
