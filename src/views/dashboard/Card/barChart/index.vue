<template>
  <div class="charts" ref="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        type: "category"
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 48, 9, 29, 19, 44, 33, 22, 26]
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {
        show: true
      }
    });
  }
};
</script>
<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>