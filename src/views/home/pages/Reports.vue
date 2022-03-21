<template>
  <div class="reports">
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    async getEchartsList() {
      var myChart = echarts.init(document.getElementById('main'))
      const { data } = await this.$http.get('reports/type/1')
      const res = _.merge(data.data, this.options)
      myChart.setOption(res)
    }
  },
  created() {},
  mounted() {
    this.getEchartsList()
  }
}
</script>

<style scoped>
</style>
