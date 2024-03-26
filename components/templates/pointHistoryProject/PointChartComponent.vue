<script>
import { Pie, mixins } from 'vue-chartjs'
export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'chartOptions'],
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .chartjs-size-monitor {
    width: 30% !important;
    margin: auto;
  }
}
</style>
