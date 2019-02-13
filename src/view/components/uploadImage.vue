<template>
    <div class="home-main">
        <div class="demo-upload-list" v-if="filePath">
            <!--<template>-->
                <img :src="filePath">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(filePath)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(filePath)"></Icon>
                </div>
            <!--</template/>-->
            <!--<template v-else>-->
                <!--<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
            <!--</template>-->
        </div>
        <Upload
                :before-upload="handleBeforeUpload"
                :action="host">
            <Button  style="width: 58px;height:58px;line-height: 48px;float: left; margin-right: 22px;">
              <!--<Icon type="ios-cloud-upload-outline" />-->
              <!--<Icon type="ios-images-outline"  size="28"/>-->
              <Icon type="ios-images" size="28"/>
              <!--<Icon type="ios-camera-outline"  size="28"/>-->
            </Button>
        </Upload>
        <!--<div v-if="file !== null">-->
            <!--文件名: {{ file.name }}-->
            <!--&lt;!&ndash;<img :src="{{filePath}}" alt="">&ndash;&gt;-->
            <!--<Button type="success" @click="upload" :loading="loadingStatus" class="">-->
                <!--点击上传-->
            <!--</Button>-->
        <!--</div>-->
        <Modal title="View Image" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
  import axios from 'axios';
  import uAxios from '../../api';
  import config from '../../api/config';
  export default {
    name: 'uploadImage',
    props:['pic'],
    data () {
      return {
        imgName: '',
        file: null,
        ossConfig: '',
        host: '',
        modal1: false,
        loadingStatus: false,
        imgName: '',
        visible: false,
        filePath: ''
      };
    },
    watch: {
      pic: function () {
        this.filePath = this.pic
        if (!this.pic) {
          this.filePath = ''
        }
      }
    },
    methods: {
      // 预览
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      // 删除
      handleRemove (file) {
//        const fileList = this.filePath;
//        this.filePath.splice(fileList.indexOf(file), 1);
        this.filePath = '';
      },
      getSignature () {
        const self = this;
        uAxios.get('upload/signature').then(res => {
          let result = res.data.data;
          self.ossConfig = result;
          self.host = result.host;
        });
      },
      // 文件上传
      handleBeforeUpload (file) {
        // console.log(file);
        this.file = file;
        this.$Notice.info({
          title: '温馨提示',
          duration: 2,
          desc: `${this.file.name}开始上传`
        });
        this.imgName = file.name;
        this.upload();
        return false;
      },
      upload () {
        var self = this;
        self.loadingStatus = true;
        var formData = new FormData();
        var fileName = self.file.name + '.' + self.file.type.split('/').pop().toLowerCase();
        var filePath = self.host + '/' + self.ossConfig.dir + fileName;
        formData.append('name', self.ossConfig.dir + fileName);
        formData.append('key', self.ossConfig.dir + fileName);
        formData.append('policy', self.ossConfig.policy);
        formData.append('OSSAccessKeyId', self.ossConfig.accessid);
        formData.append('success_action_status', '200');
        formData.append('signature', self.ossConfig.signature);
        formData.append('file', self.file);
        formData.append('filename', self.file.name);
        // console.log(formData);
        axios.post(self.ossConfig.host, formData, {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function (response) {
          if (response.status === 200) {
            console.log(filePath);
            self.filePath = filePath;
            self.$emit('uploadPictures',self.filePath)
            self.$Notice.success({
              title: '文件上传成功',
              desc:  `${filePath}上传成功!`
            });
            self.file = null;
          } else {
            self.$Modal.error({
              content: response.statusText
            });
          }
        });
        self.loadingStatus = false;
      },
    },
    mounted () {
      this.getSignature();
      this.filePath = this.pic;
    }
  };
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .ivu-upload{
        display: inline-block;
    }
</style>
