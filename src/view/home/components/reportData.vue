<template>
  <div style="width:100%;height: 100%;" id="report_data_con"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'reportData',
  props: ['columnar'],
  data () {
    return {

    }
  },
  watch: {
    columnar: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('report_data_con'))
      serviceRequestCharts.setOption(this.columnar)
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize()
      })
    }
  },
  mounted () {
  }
}
</script>
