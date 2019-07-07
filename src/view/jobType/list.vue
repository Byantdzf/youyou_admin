<template>
  <Card>
    <p slot="title" style="color: none;">兼职类型</p>
    <div>
      <Row>
        <Col span="6">
          <p class="title _bold">一级目录</p>
          <div class="text-center oneStair">
            <p class="bc_p">
              <span>技术兼职</span>
              <Icon type="ios-paper-outline" size="18" color="#2D8cF0" style="margin: 0 6px;"/>
              <Icon type="ios-trash-outline" size="18" color="#f50323"/>
              <Icon type="ios-arrow-dropright-circle" size="18" color="#666666" style="margin-left: 6px;"/>
            </p>
          </div>
        </Col>
        <Col span="4" offset="2">
          <p class="title">子目录</p>
          <div class="text-center">
            <Input type="text" class="input"/>
          </div>
        </Col>
      </Row>
    </div>
  </Card>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      renderContent () {
      },
      append (data) {
      },
      remove (root, node, data) {
      }
    }
  }
</script>
<style lang="less">
  .text-center{
    text-align: center;
  }
  .title{
    text-align: center;
    margin-bottom: 12px;
  }
  .input{
    text-align: center;
    width: 160px;
    margin-bottom: 12px;
  }
  .oneStair{
    position: relative;
    width: 100%;
    font-size: 12px;
    .input{
      width: 100%;
      margin: 0;
    }
    .bc_p{
      width: 180px;
      border-bottom: 1px solid #666666;
      margin: auto;
      padding: 4px;
    }
  }
  ._bold {
    font-weight: bold
  }
</style>
