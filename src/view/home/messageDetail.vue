<template>
  <div class="hello">
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: #ff6c4c;">群发详情</p>
      <Row>
        <Col span="14" >
          <Card style="overflow: hidden;">
            <div class="bc_box">
              <div class="font_16 _bold bc_title">发送时间：</div>
              <Input placeholder="Enter something..." class="bc_input" :value="messages.created_at" :readonly="true"/>
            </div>
            <div class="bc_box">
              <div class="font_16 _bold bc_title">发送内容：</div>
              <Input placeholder="Enter something..." class="bc_input" type="textarea" :readonly="true" :value="messages.content"/>
            </div>
            <div class="bc_box">
              <div class="font_16 _bold bc_title">接收成员：</div>
            </div>
            <div v-if="messages.type === 'ALL'">
              全部成员
            </div>
            <div v-else>
              <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
              <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                    style="float:right;margin: 12px;"></Page>
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
    name: 'massTexting',
    components: {
      dropdown: dropdown,
      uploadImage: uploadImage,
      informPic: uploadImage
    },
    data () {
      return {
        loading: false,
        orgTotal: 1,
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
            title: '用户类型',
            key: 'type',
            render: (h, params) => {
              let text;
              switch (params.row.type) {
                case 'single':
                  text = '单身'
                  break;
                case 'marriage':
                  text = '介绍人'
                  break;
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
                        name: 'user_detail',
                        params: argu
                      })
                    }
                  }
                }, '查看详情')
              ])
            }
          }
        ],
        information: [],
        messages: {},
        loading: false
      }
    },
    methods: {
      handlePage (num) {
        this.getlist(num)
      },
      getlist (page = 1) {
        let self = this
        uAxios.get(`admin/assistant/messages/${self.id}?page=${page}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.messages = result
            self.information = result.users.data
            self.orgTotal = result.users.total
          })
      }
    },
    mounted () {
      this.id = this.$route.params.id
      if (this.id > 0) this.getlist()
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
      float: right;
      max-width: 300px;
    }

    .bc_title {
      margin-top: 6px;
      float: left;
    }

  }
</style>
