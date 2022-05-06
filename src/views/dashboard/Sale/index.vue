<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visitor"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            class="date"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{title}}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>4</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>5</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>6</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
             <li>
              <span>7</span>
              <span style="margin:0 10px;">肯德基</span>
              <span class="rvalue">123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
import dayjs from 'dayjs'
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myCharts:null,
      date:[]
    };
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: {
        text: this.title+'趋势'
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 110, 98, 167, 123, 44]
        }
      ]
    });
  },
  computed: {
      title(){
          return this.activeName=='sale'?'销售额':'访问量'
      }
  },
  watch:{
      //mounted只会执行一次，所以要监视
      title(){
        this.myCharts.setOption({
            title:{
                text:this.title+'趋势'
            }
        })
      }
  },
  methods:{
      //date是双向绑定的数据
      setDay(){
        const day = dayjs().format('YYYY-MM-DD');
        this.date=[day,day]
      },
      setWeek(){
          //dayjs的固定写法
          const start = dayjs().day(1).format('YYYY-MM-DD');
          const end = dayjs().day(7).format('YYYY-MM-DD');
          this.date=[start,end];
      },
      setMonth(){
          const start = dayjs().startOf('month').format('YYYY-MM-DD');
          const end = dayjs().endOf('month').format('YYYY-MM-DD');
          this.date=[start,end];
      },
      setYear(){
          const start = dayjs().startOf('year').format('YYYY-MM-DD');
          const end = dayjs().endOf('year').format('YYYY-MM-DD');
          this.date=[start,end];
      }
  }
};
</script>
<style scoped>
.el-card__header {
  border-bottom: none;
}
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 200px;
  margin: 0 10px;
}
.right span {
  margin: 0 5px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul > li {
  height: 8%;
  margin: 6px 0;
}
.rindex {
  float: left;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  color: white;
  background-color: black;
}
.rvalue {
  float: right;
}
</style>