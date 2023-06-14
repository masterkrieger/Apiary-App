 <template>
  <div>
    <h1>Hive Weights</h1>
    <div>
      <button @click="setDaily">Day</button>
      <button @click="setWeekly">Week</button>
      <button @click="setMonthly">Month</button>
      <button @click="setYearly">Year</button>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div class="chart-container" style="position: relative; height:40vh; width:90vw">
      <canvas id="apiaryChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend, Tooltip } from 'chart.js';
import axios from "axios";
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend, Tooltip);

export default {
  name: 'apiaryChart',
  data() {
    return {
      chart: null,
      ipAddress: '172.22.69.16:3001',
      chartData: null,
      colorIndex: 0,
      colorList: ['#FF6384', '#36A2EB', '#FFCE56', '#33FF9F', '#FF9F33', '#9F33FF'],
      errorMessage: '',
    };
  },
  mounted() {
    this.setMonthly();
    //this.renderChart();
  },
  methods: {
    getCycledColor() {
      const color = this.colorList[this.colorIndex];
      this.colorIndex = (this.colorIndex + 1) % this.colorList.length;
      return color;
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    fetchDataByDate(date) {
      const ipAddress = this.ipAddress;
      const url = `http://${ipAddress}/api/hives/date/${date}`;
      return axios.get(url)
        .then((response) => {
          const hiveData = response.data;
          if (hiveData.length === 0) {
            this.errorMessage = 'No data available for the selected date.';
          } else {
            this.processHiveData(hiveData);
            this.updateChart();
          }
        })
        .catch((error) => {
          throw error;
        });
    },    
    processHiveData(hiveData) {
      // Process the provided data to extract the hive labels and data
      const hives = [...new Set(hiveData.map((hive) => hive.name))]; // Get unique hive names

      const datasets = hives.map((hive) => {
        const data = hiveData
          .filter((item) => item.name === hive)
          .map((item) => ({
            x: new Date(item.date),
            y: item.weight,
          }));

        return {
          label: hive,
          data: data,
          borderColor: this.getCycledColor(),
          fill: false,
        };
      });

      this.chartData = {
        datasets: datasets,
      };
    },
    renderChart() {
      //const ctx = this.$refs.apiaryChart.getContext('2d');
      const ctx = document.getElementById('apiaryChart');

      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#36495d'
              }
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: ((context) => {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y + ' lbs';
                  }
                  return label;
                })
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
            },
            y: {
              beginAtZero: false,
              ticks: {
                padding: 25,
                callback: ((value) => {
                  return value + ' lbs';
                })
              }
            },
          },
        }
      });
    },
    updateChart() {
      this.colorIndex = 0;
      if (this.chart) {
        this.chart.destroy();
        this.chart = null; // Set chart to null after destruction
      }
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    setDaily() {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const formattedDate = oneDayAgo.toISOString();

      this.errorMessage = '';
      this.fetchDataByDate(formattedDate);
    },
    setWeekly() {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const formattedDate = oneWeekAgo.toISOString();

      this.errorMessage = '';
      this.fetchDataByDate(formattedDate);
    },
    setMonthly() {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const formattedDate = oneMonthAgo.toISOString();

      this.errorMessage = '';
      this.fetchDataByDate(formattedDate);
    },
    setYearly() {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const formattedDate = oneYearAgo.toISOString();

      this.errorMessage = '';
      this.fetchDataByDate(formattedDate);
    },
  },
};
</script>

<style>
.error-message {
  color: red;
}
</style>
