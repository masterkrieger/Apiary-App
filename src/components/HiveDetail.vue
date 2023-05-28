import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    hive: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.renderChart({
      labels: this.hive.weights.map(w => w.date),
      datasets: [
        {
          label: 'Weight',
          backgroundColor: '#f87979',
          data: this.hive.weights.map(w => w.weight)
        }
      ]
    }, { responsive: true, maintainAspectRatio: false })
  }
}