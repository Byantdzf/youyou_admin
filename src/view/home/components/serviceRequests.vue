<template>
    <div style="width:100%;height: 100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'serviceRequests',
  props: ['option'],
  watch: {
    option: function () {
      const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
      serviceRequestCharts.setOption(this.option);
      window.addEventListener('resize', function () {
        serviceRequestCharts.resize();
      });
    }
  },
  mounted() {
  }
};
</script>
