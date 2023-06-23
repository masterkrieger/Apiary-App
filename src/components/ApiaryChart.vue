<template>
  <div>
    <h1>Hive Weights</h1>
    <div class="button-container">
      <button @click="setDaily">Day</button>
      <button @click="setWeekly">Week</button>
      <button @click="setMonthly">Month</button>
      <button @click="setYearly">Year</button>
    </div>
    <div class="chart-container" style="position: relative; height:40vh;">
      <Line ref="linechart" :key="chartKey" :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div class="alert alert-info" v-if="loading">
      Loading...
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'vue-chartjs';
import axios from "axios";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend, Tooltip );

export default {
  name: 'apiaryChart',
  components: { Line },
  data() {
    return {
      chartData: null,
      colorIndex: 0,
      colorList: ['#FAD33D', '#DC893B', '#BB3D04', '#FFF472', '#DC893B', '#FAE7BF'],
      chartKey: '', // Key for updating the chart component
      errorMessage: '',
      loading: false,
    };
  },
  mounted() {
    this.setMonthly();
  },
  computed: {
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + ' lbs';
              }
              return label;
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                hour: 'HH, dd MMM',
                day: 'dd MMM, yyyy',
                month: 'MMM yyyy',
              }
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (lbs)'
            }
          },
        },
      };
    },
  },
  methods: {
    getCycledColor() {
      const color = this.colorList[this.colorIndex];
      this.colorIndex = (this.colorIndex + 1) % this.colorList.length;
      return color;
    },
    fetchDataByDate(date) {
      const url = `/api/hives/date/${date}`;
      return axios.get(url)
        .then((response) => {
          const hiveData = response.data;
          if (hiveData.length === 0) {
            this.errorMessage = 'No data available for the selected date.';
          } else {
            this.processHiveData(hiveData);
          }
        })
        .catch((error) => {
          this.errorMessage = 'Error retrieving hiveData: ' + error.message;
          //throw error;
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
        
        const color = this.getCycledColor();

        return {
          label: hive,
          data: data,
          borderColor: color, //'#FAE7BF',
          pointBackgroundColor: '#BB3D04',
          backgroundColor: color, //'#FAD33D',
          fill: false,
        };
      });

      this.chartData = {
        datasets: datasets,
      };
    },
    updateData(interval) {
      const intervalDate = new Date();
      this.colorIndex = 0;  // reset colorIndex of the dataset colors array.
      
      if (interval === 'day') {
        intervalDate.setDate(intervalDate.getDate() - 1);
      } else if (interval === 'week') {
        intervalDate.setDate(intervalDate.getDate() - 7);
      } else if (interval === 'month') {
        intervalDate.setMonth(intervalDate.getMonth() - 1);
      } else if (interval === 'year') {
        intervalDate.setFullYear(intervalDate.getFullYear() - 1);
      }

      const formattedDate = intervalDate.toISOString();	  
     
      this.errorMessage = '';
      this.loading = true;
      this.fetchDataByDate(formattedDate)
        .finally(() => {
          this.loading = false;
          this.chartKey = interval; // Update the chart key
        });
    },
    setDaily() {
      this.chartOptions.scales.x.time.unit = 'hour';
      this.updateData('day');
    },
    setWeekly() {
      this.chartOptions.scales.x.time.unit = 'day';
      this.updateData('week');
    },
    setMonthly() {
      this.chartOptions.scales.x.time.unit = 'day';
      this.updateData('month');
    },
    setYearly() {
      this.chartOptions.scales.x.time.unit = 'month';
      this.updateData('year');
    },
  },
};
</script>

<style>
  h1 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 20px 0;
  }
  .alert {
    padding: 1em;
    width: 100%;
    background-color: #F9F4E3;
    font-size: 0.7rem;
    font-family: sans-serif;
    padding: 0.5rem;
    text-align: center;
    margin: 0rem 1rem;
  }
  .button-container {
    display: flex;
    background-color: #FAD33D;
    margin: 0 1rem;
  }
  .button-container > button {
    flex: 1;
    padding: 0.7rem;
    background-color: #BB3D04;
    color: white;
    border: none;
    font-size: 0.8rem;
    font-family: sans-serif;
    text-transform: uppercase;
    margin-right: 0.2rem;
    margin-left: 0.2rem;
  }
  .chart-container {
    background-color: #F9F4E3;
    padding: 0.5rem;
    margin: 1rem;
  }
  .error-message {
    color: #F9F4E3;
    background-color: #DC893B;
    font-size: 0.7rem;
    font-family: sans-serif;
    padding: 0.5rem;
    text-align: center;
    margin: 0rem 1rem;
  }
</style>
