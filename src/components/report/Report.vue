<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!--2、 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
//1、导入echarts
// import echarts from 'echarts'
// 安装echarts版本为5，这里用import报init未定义的错误，但改为AMD规范下的导入require就正常了？
const echarts = require("echarts");

import _ from 'lodash'

export default {
  data() {
    return {
      objMergeResult: {},
      //需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},
  //此时页面上的元素，已经被渲染完毕
  async mounted() {
    // 3、基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // this.getData();
    // 4、指定图表的配置项和数据
      const { data: res } = await this.$http.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message.error("获取折线图数据失败！");
      }
      this.objMergeResult = _.merge(res.data, this.options)
    // 5、使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.objMergeResult);
  },
  methods: {
    // async getData() {
    //   const { data: res } = await this.$http.get("reports/type/1");
    //   if (res.meta.status !== 200) {
    //     return this.$message.error("获取折线图数据失败！");
    //   }
    //   console.log(res.data)
    //   this.objMergeResult = _.merge(res.data, this.options)
    //   console.log(this.objMergeResult);
    // },
  },
};
</script>

<style>
</style>