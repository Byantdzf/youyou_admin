<template>
  <div id="app">
    <div id="myPageTop">
      <label for="tipinput">活动地址：</label>
      <input id="tipinput" class="input" placeholder="输入地址关键字" v-model="keyword"/>
      <!--<input class="input" placeholder="地址补充说明(选填)" v-model="doorplate" style="width: 28%;"/>-->
      <!--不懂？<span style="color: #2d8cf0" @click="showCodeFn">查看示例</span>-->
    </div>
    <div id="container" style="width: 100%;height: 600px;"></div>
    <Modal v-model="showCode" width="680" title="这是示例图">
      <img src="http://images.ufutx.com/201904/30/09520f195554f63fffea3280fce46fe8.jpeg" alt="" width="100%">
    </Modal>
  </div>
</template>

<script>
  export default {
    props: ['setLocation'],
    data () {
      return {
        keyword: '',
        showCode: false,
        address: {},
        getLng: '', // 点击的纬度
        getLat: '', // 点击的经度
        lnglat: []
      }
    },
    watch: {
      keyword () {
        this.address.address = this.keyword
        this.$emit('getLocation', this.address, this.lnglat)
      }
    },
    methods: {
      showCodeFn () {
        this.$Modal.remove()
        this.$emit('hideModal', false)
        this.showCode = true
      },
      init () {
        let vm = this
        let marker, map = new AMap.Map('container', { // 初始化地图
          center: vm.setLocation.length > 0 &&  vm.setLocation[0] !== null? vm.setLocation : [114.0595600000, 22.5428600000],
          resizeEnable: true,
          zoom: 16,
          keyboardEnable: false,
          resizeEnable: true,
          viewMode: '3D',
          pinch: 45
        })
        map.setFitView();
        let geocoder
        let auto = new AMap.Autocomplete({input: 'tipinput'})  // 绑定搜索input
        let infoWindow = new AMap.InfoWindow({ // 构造标注点的文本参数
          autoMove: true,
          offset: new AMap.Pixel(4, -30)
        })
        let placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          map: map,
          pageSize: 1, // 单页显示结果条数
          extensions: 'base' //返回基本地址信息
        })

        function regeoCode (getLng, getLat) {
          if (!geocoder) {
            geocoder = new AMap.Geocoder({
              city: '010', //城市设为北京，默认：“全国”
              radius: 1000 //范围，默认：500
            })
          }
          vm.lnglat = [getLng, getLat]
          if (!marker) {
            marker = new AMap.Marker({
              icon: 'http:////a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
              position: [getLng, getLat],
              offset: new AMap.Pixel(-13, -30),
              // draggable: true,
              cursor: 'move',
              raiseOnDrag: true
            })
            map.add(marker)
          }
          marker.setPosition(vm.lnglat)
          map.setCenter(marker.getPosition())
          // marker.on('dragging', (e) => {
          //   console.log(e)
          //   let {lng, lat} = e.lnglat
          //   regeoCode(lng, lat)
          // });
          geocoder.getAddress(vm.lnglat, function (status, result) {
            if (status === 'complete' && result.regeocode) {
              console.log(result.regeocode.addressComponent)
              let address = result.regeocode.formattedAddress,
                citycode = result.regeocode.addressComponent.citycode,
                value = {
                  address: address,
                  province: result.regeocode.addressComponent.province,
                  city: result.regeocode.addressComponent.city,
                  dist: result.regeocode.addressComponent.district
                }
              vm.keyword = address
              vm.address = value
              infoWindow.setContent(createContent(address, vm.lnglat, citycode))
              infoWindow.open(map, marker.getPosition())
              vm.$emit('getLocation', value, vm.lnglat)
            } else {
              vm.$Notice.error({
                title: '温馨提示：',
                desc: `位置有误！`
              })
            }
          })
        }

        function createContent (address, lnglat, citycode) {  //信息窗体内容
          let s = []
          s.push(`<b>经纬度：${lnglat}</b>`)
          s.push(`地址：${address}`)
          s.push(`区号：${citycode}`)
          return s.join('<br>')
        }

        function select (e) {  // 搜索函数
          placeSearch.setCity(e.poi.adcode)
          placeSearch.search(e.poi.name, (status, result) => {  // 关键字查询查询
            console.log(status)
            let {lng, lat} = result.poiList.pois[0].location
            regeoCode(lng, lat)
          })
        }

        AMap.event.addListener(auto, 'select', select) // 注册监听，当选中某条记录时会触发
        AMap.event.addListener(placeSearch, 'markerClick', (e) => { // 点击标注
        })
        map.on('click', (e) => { // 点击地图添加标注点
          regeoCode(e.lnglat.getLng(), e.lnglat.getLat())
        })
        map.on('dragend', () => { // 移动地图
          regeoCode(map.getCenter().lng, map.getCenter().lat)
        })
        map.on('complete', () => {  // 地图加载完成
          regeoCode(map.getCenter().lng, map.getCenter().lat)  // 初始化地图中心点坐标
        })
        AMap.plugin([ // 添加 3D 罗盘控制
          'AMap.ControlBar',
        ], () => {
          map.addControl(new AMap.ControlBar())
        })
      }

    },
    mounted () {
      setTimeout(() => {
        this.init()
      }, 1200)
    }
  }
</script>

<style>
  .input {
    width: 72%;
    border: none;
    background: none;
    padding: 4px 12px;
    margin-right: 16px;
    margin-bottom: 16px;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
  }

  .amap-marker:first-child .amap-icon img {
    width: 25px;
    height: 34px;
  }

  .amap-icon img {
    width: 25px !important;
    height: 34px !important;
  }

  .amap-info-outer {
    border-radius: 8px;
    padding: 16px;
    line-height: 1.6;
  }

  .amap-info-sharp {
    background: none;
    width: 0;
    height: 0;
    border-width: 18px 24px 0px 0px;
    border-style: solid;
    border-color: #ffffff transparent transparent; /*灰 透明 透明 */
    margin: 0px auto;
    position: relative;
  }

  .amap-info-close {
    right: 4px !important;
    top: 4px;
  }
</style>
