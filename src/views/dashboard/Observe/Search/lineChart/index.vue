<template>
    <div>
        <div class="header">
          <span>搜索用户数</span>
          <svg t="1651807151278" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1900" width="26" height="26"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="1901" fill="#515151"></path></svg>
        </div>
        <div class="main">
          <span class="main-title">12321</span>
          <span class="main-content">17.1</span>
          <svg t="1651808734455" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6255" width="16" height="16"><path d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0" fill="#d81e06" p-id="6256"></path></svg>
          <svg t="1651808770203" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7398" width="16" height="16"><path d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0" fill="#1afa29" p-id="7399"></path></svg>
        </div>
        <div class="footer">
          <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "LineSearch",
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
          type: "line",
          data: [10, 7, 33, 12, 48, 9,29,19,44,33,22,26],
          //拐点样式设置
          itemStyle: {
            opacity: 0
          },
          smooth:true,
          //线条的设置
          lineStyle: {
            color: "purple"
          },
          //填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    });
  }
};
</script>
<style scoped>
.header{
  display: flex;
  text-align: center;
  justify-content: space-around;
}
.main{
  margin: 10px 0;
}
.main-title{
  margin-right: 30px;
}
.main-content{
  margin-right: 10px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>