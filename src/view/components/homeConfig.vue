<style lang="less">
.margin-bottom-10{
    margin-bottom: 20px;
}
</style>
<template>
    <div class="home-main">
        <Card :bordered="true" class="margin-bottom-10">
            <p slot="title">{{title}}</p>
            <Row>
                <Col span="12">
                <Form ref="formDynamic" :model="formDynamic" :label-width="10" style="width: 400px">
                    <FormItem
                            v-for="(item, index) in formDynamic.items"
                            :key="index"
                            :prop="'items.' + index + '.value'">
                        <Row>
                            <Col span="12">
                            <Input type="text" v-model="item.name" placeholder="测试标题..." readonly="readonly"></Input>
                            </Col>
                            <Col span="7" :offset="1">
                            <Button @click="handleEdit(item, index)" type="primary" size="small">编辑</Button>
                            <Button @click="handleDelete(index)" type="error" size="small">删除</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="12">
                            <Button long @click="handleAdd" type="primary">+ 添加{{title}}</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                </Col>
                <Col span="12" v-if="showEdit">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <FormItem label="名称" prop="name">
                        <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                    </FormItem>
                    <FormItem label="链接" prop="link">
                        <Input v-model="formValidate.link" placeholder="Enter your page"></Input>
                    </FormItem>
                    <FormItem label="图片" prop="image">
                        <Card>
                            <uploadImage v-on:uploadPictures="uploadPictures" :pic="formValidate.pic"></uploadImage>
                        </Card>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                    </FormItem>
                </Form>
                </Col>
            </Row>
        </Card>
        <Modal
                v-model="showModel"
                title="温馨提示"
                @on-ok="handleRemove"
                @on-cancel="cancel">
            <h3>是否确认执行该操作？</h3>
        </Modal>
    </div>
</template>

<script>
  import axios from 'axios';
  import uAxios from '../../api';
  import config from '../../api/config';
  import uploadImage from '../components/uploadImage';
  export default {
    name: 'homeConfig',
    components: {uploadImage},
    props: ['configData', 'title'],
    data () {
      return {
        slideshow: '',  // 上传轮播图
        showModel: false, // 弹框
        showEdit: false, // 编辑轮播
        index: 1,
        formDynamic: {
          items: []
        },
        formValidate: {
          name: '',
          link: '',
          pic: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入链接', trigger: 'blur' },
          ],
          pic: [
            { required: true, message: '请上传图片', trigger: 'blur' },
          ]
        }
      };
    },
    watch: {
      configData:function () {
        this.formDynamic.items = []
        if (this.configData) {
          if (this.title == '推荐企业'){
            return this.configData.value.forEach((item) => {
              this.formDynamic.items.push({
                name: item.name,
                link: item.link,
                pic: item.logo
              });
            });
          }
          this.configData.value.forEach((item) => {
            this.formDynamic.items.push({
              name: item.name,
              link: item.link,
              pic: item.pic
            });
          });
        }
      }
    },
    methods: {
      // 上传文件子组件传递
      uploadPictures (image) {
        this.formValidate.pic = image;
      },
      // 弹框
      cancel () {
        this.$Message.info('Clicked cancel');
      },
      // 表单
      handleSubmit (type) {
        if (!this.formValidate.name){return this.$Message.error('请填写标题!');}
        if (!this.formValidate.link){return this.$Message.error('请填写链接!');}
        if (!this.formValidate.pic){return this.$Message.error('请上传图片!');}
        if(this.type == 'Edit') {
          if (this.title == '推荐企业') {
            this.formDynamic.items[this.index] = {
              name: this.formValidate.name,
              link: this.formValidate.link,
              logo: this.formValidate.pic
            };
          } else {
            this.formDynamic.items[this.index] = {
              name: this.formValidate.name,
              link: this.formValidate.link,
              pic: this.formValidate.pic
            };
          }
        }else{
          if (this.title == '推荐企业') {
            this.formDynamic.items.push({
              name: this.formValidate.name,
              link: this.formValidate.link,
              logo: this.formValidate.pic
            });
          } else {
            this.formDynamic.items.push({
              name: this.formValidate.name,
              link: this.formValidate.link,
              pic: this.formValidate.pic
            });
          }
        }
        this.executeConfig();
      },
      executeConfig(){
        let data = {
          value: this.formDynamic.items
        };
        uAxios.put(`home/configs/${this.configData.id}`, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.success('保存成功!');
            this.showEdit = false;
            this.formValidate = {};
          } else {
            this.$Modal.error({
              content: response.data.message
            });
          }
        });
      },
      handleAdd () {
        this.showEdit = true;
        this.type = 'add';
      },
      handleDelete (index) {
        this.index = index;
        this.showModel = true;
      },
      handleRemove () {
        this.formDynamic.items.splice(this.index, 1);
        this.executeConfig();
      },
      handleEdit (item, index) {
        this.index = index;
        this.type = 'Edit';
        this.showEdit = true;
        if (this.title == '推荐企业') {
          this.formValidate = {
            name: item.name,
            link: item.link ? item.link : '',
            pic: item.logo
          };
        } else {
          this.formValidate = {
            name: item.name,
            link: item.link ? item.link : '',
            pic: item.pic
          };
        }
//        console.log(this.formValidate)
      }
    },
    mounted () {

    }
  };
</script>
