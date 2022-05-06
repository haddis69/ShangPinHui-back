<template>
  <div class="charts" ref="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        min:0,
        max:100
      },
      yAxis: {
        show: false,
        type: "category"
      },
      series: [
        {
          type: "bar",
          data: [78],
          barWidth:10,
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          //右侧的"|"小竖条，默认是个数字
          label:{
            show:true,
            formatter:'|',
            position:'right'
          }
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