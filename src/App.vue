<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.ivu-badge-count-alone {
  transform: translateX(6px) !important;
  background: red !important;
  min-width: 22px !important;
  height: 22px !important;
  text-align: center !important;
  line-height: 20px !important;
  border-radius: 12px !important;
}
</style>
