<template>
  <Card>
    <p slot="title" style="color: none;">兼职类型</p>
    <div>
      <Row>
        <Col span="6">
          <p class="title _bold">
            <span style="margin-right: 12px;">一级目录</span>
            <Button icon="ios-add" class="addType" size="small" @click="handleRender('class')"></Button>
          </p>
          <div class="text-center oneStair" v-for="item,index in information">
            <p class="bc_p">
              <span>{{item.name}}</span>
              <Icon type="ios-paper-outline" size="18" color="#2D8cF0" style="margin: 0 6px;" @click="amendClass(item.id, item.name)"/>
              <Icon type="ios-trash-outline" size="18" color="#f50323" @click="deleteClass(item.id)"/>
              <Icon type="ios-arrow-dropright-circle" size="18" :color="item.active?'#2d8cf0':'#666666'"
                    style="margin-left: 6px;" @click="getsub(index,item)"/>
            </p>
          </div>
        </Col>
        <Col span="4" offset="2" v-if="showSub">
          <p class="title _bold">
            <span style="margin-right: 12px;">子目录</span>
            <Button icon="ios-add" class="addType" size="small" @click="handleRender('sub_class')"></Button>
          </p>
          <div class="text-center oneStair" v-for="item,index in sub_categories">
            <p class="bc_p">
              <span>{{item.name}}</span>
              <Icon type="ios-paper-outline" size="18" color="#2D8cF0" style="margin: 0 6px;" @click="amendClass(item.id, item.name)"/>
              <Icon type="ios-trash-outline" size="18" color="#f50323" @click="deleteClass(item.id)"/>
            </p>
          </div>
        </Col>
      </Row>
    </div>
    <Row>
      <Col span="12" class="text-center" style="margin-top: 12px;">
        <!--<Button type="primary" icon="ios-checkmark-circle-outline">保存</Button>-->
      </Col>
    </Row>
    <Modal
      v-model="modal"
      title="请填写类名"
      @on-ok="ok">
      <Input v-model="value" placeholder="Enter something..." style="width: 300px"/>
    </Modal>
  </Card>
</template>
<script>
  import uAxios from '../../api'

  export default {
    data () {
      return {
        information: [],
        sub_categories: [],
        modal: false,
        value: '',
        index: 0,
        parent_id: 0,
        showSub: false,
        valueClass: ''
      }
    },
    methods: {
      getsub (index, item) {
        this.showSub = true
        for (let item of this.information) {
          item.active = false
        }
        this.parent_id = item.id
        this.information[index].active = true
        this.sub_categories = item.sub_categories?item.sub_categories:[]
      },
      ok () {
        if (this.value.length > 4) {
          return this.$Message.error('为了更好地展示，请不要大于4个字')
        }
        if (this.valueClass === 'class') {
          console.log(this.value,'class')
          uAxios.post('admin/job/categories',{name: this.value})
            .then(res => {
              this.$Message.success('添加成功')
              this.getlist()
            })
        } else {
          console.log(this.value, 'sub_class')
          console.log(this.parent_id)
          uAxios.post('admin/job/categories', {name: this.value, parent_id: this.parent_id})
            .then(res => {
              this.$Message.success('添加成功')
              this.getlist()
            })
        }
        this.value = ''
        console.log(this.information)
      },
      append (data) {
      },
      deleteClass (id) {
        let vm = this
        vm.$Modal.confirm({
          title: '温馨提示',
          content: '<p>是否确定删除该类目</p>',
          onOk: () => {
            uAxios.delete(`admin/job/categories/${id}`)
              .then(res => {
                vm.$Message.success('删除成功')
                vm.getlist()
              })
          }
        });
      },
      amendClass (id, name) {
        let vm = this,
          value = ''
        vm.$Modal.confirm({
          title: '修改类名',
          render: (h) => {
            return h('Input', {
              props: {
                value: name,
                autofocus: true,
                placeholder: 'Please enter your name...'
              },
              on: {
                input: (val) => {
                  value = val
                }
              }
            })
          },
          onOk: () => {
            if (value.length > 4) {
              return this.$Message.error('为了更好地展示，请不要大于4个字')
            }
            uAxios.put(`admin/job/categories/${id}`, {name: value})
              .then(res => {
                vm.$Message.success('修改成功')
                vm.getlist()
              })
          }
        })
        // vm.$Modal.confirm({
        //   title: '温馨提示',
        //   content: '<p>是否确定删除该类目</p>',
        //   onOk: () => {
        //     uAxios.delete(`admin/job/categories/${id}`)
        //       .then(res => {
        //         vm.$Message.success('删除成功')
        //         vm.getlist()
        //       })
        //   }
        // });
      },
      handleRender (type) {
        this.modal = true
        this.valueClass = type
      },
      getlist (page = 1) {
        let self = this
        uAxios.get('admin/job/categories?nopage=1')
          .then(res => {
            let result = res.data.data
            self.information = result.map((item, index) => {
              return {
                name: item.name,
                id: item.id,
                active: false,
                sub_categories: item.sub_categories
              }
            })
            if (this.parent_id) {
              for (let item of self.information) {
                if (item.id == this.parent_id) {
                  item.active = true
                  this.sub_categories = item.sub_categories?item.sub_categories:[]
                }
              }
            }
            console.log(self.information)
          })
      }
    },
    mounted () {
      this.getlist(1)
    }
  }
</script>
<style lang="less">
  .text-center {
    text-align: center;
  }

  .title {
    text-align: center;
    margin-bottom: 12px;
  }

  .input {
    text-align: center;
    width: 160px;
    margin-bottom: 12px;
  }

  .oneStair {
    position: relative;
    width: 100%;
    font-size: 12px;
    margin-bottom: 12px;

    .input {
      width: 100%;
      margin: 0;
    }

    .bc_p {
      width: 140px;
      border-bottom: 1px solid #666666;
      margin: auto;
      padding: 4px;
    }
  }

  ._bold {
    font-weight: bold
  }

  .addType {
    margin: auto;
  }
</style>
