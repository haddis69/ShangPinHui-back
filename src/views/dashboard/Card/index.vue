<template lang="">
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="¥126560">
            <template slot="charts">
              <span style="fontSize:12px;">周同比56.67%<svg t="1651808734455" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6255" width="16" height="16"><path d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0" fill="#d81e06" p-id="6256"></path></svg></span>
              &nbsp;
              <span style="fontSize:12px;">日同比19.16%<svg t="1651808770203" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7398" width="16" height="16"><path d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0" fill="#1afa29" p-id="7399"></path></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额 ¥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="¥88460">
            <template slot="charts">
              <LineChart/>
            </template>
            <template slot="footer">
                 <span>日访问量1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="¥88460">
            <template slot="charts">
              <BarChart/>
            </template>
            <template slot="footer">
                 <span>转换率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart/>
            </template>
            <template slot="footer">
              <span style="fontSize:12px;">周同比56.67%<svg t="1651808734455" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6255" width="16" height="16"><path d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0" fill="#d81e06" p-id="6256"></path></svg></span>
              &nbsp;
              <span style="fontSize:12px;">日同比19.16%<svg t="1651808770203" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7398" width="16" height="16"><path d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0" fill="#1afa29" p-id="7399"></path></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LineChart from './lineChart'
import BarChart from './barChart'
import Detail from "./Detail";
import ProgressChart from './progressChart'
export default {
  name: "Card",
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  }
};
</script>
<style lang=""></style>
