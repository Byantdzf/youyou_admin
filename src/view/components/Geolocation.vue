<template>
  <div id="app">
      <div id="myPageTop">
        <input id="tipinput" class="input" placeholder="输入地址关键字"/>
        <input class="input" placeholder="地址补充说明(选填)" v-model="doorplate"/>
        不懂？<span style="color: #2d8cf0" @click="showCodeFn">查看示例</span>
      </div>
      <div id="container" style="width: 100%;height: 600px;"></div>
    <Modal v-model="showCode" width="680" title="这是示例图">
      <img src="http://images.ufutx.com/201904/30/09520f195554f63fffea3280fce46fe8.jpeg" alt="" width="100%">
    </Modal>
  </div>
</template>

<script>
  export default {
    props: ['location'],
    data () {
      return {
        doorplate: '',
        showCode: false,
        address: {}
      }
    },
    watch: {
      doorplate () {
        this.$emit('getLocation', this.address, this.doorplate)
      }
    },
    methods: {
      showCodeFn () {
        this.$Modal.remove()
        this.$emit('hideModal', false)
        this.showCode = true
      },
      init(){
        let vm = this
        var map = new AMap.Map('container', {
          resizeEnable: true,
          center: vm.location,
          zoom: 13,
          keyboardEnable: false
        })
        //输入提示
        var autoOptions = {
          input: 'tipinput'
        }
        var auto = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          map: map
        });  //构造地点查询类
        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name,);  //关键字查询查询
        }
        AMap.event.addListener(placeSearch, 'markerClick', (e) => {
          vm.address = e.data
          vm.$emit('getLocation', e.data, vm.doorplate)
        })
      }

    },
    mounted () {
      setTimeout(()=>{
        this.init()
        console.log(this.location)
      },800)
    }
  }
</script>

<style>
  .input{
    width: 220px;
    border: none;
    background: none;
    padding: 4px 12px;
    margin-right: 16px;
    margin-bottom: 16px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
  }
</style>
