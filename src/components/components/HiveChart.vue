<template>
  <div>
    <h1>Hive Weights</h1>
    <div>
      <button @click="setWeekly">Weekly</button>
      <button @click="setDaily">Daily</button>
      <button @click="setYearly">Yearly</button>
    </div>
    <div>
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'HiveWeights',
  setup() {
    const chartRef = ref(null);
    const chart = ref(null);
    const data = ref(null);
    const options = ref(null);
    const interval = ref(null);
    const hive1 = ref(null);
    const hive2 = ref(null);
    const weekly = ref(true);
    const daily = ref(false);
    const yearly = ref(false);

    const setWeekly = () => {
      weekly.value = true;
      daily.value = false;
      yearly.value = false;
      clearInterval(interval.value);
      interval.value = setInterval(() => {
        updateData('week');
      }, 604800000);
    };

    const setDaily = () => {
      weekly.value = false;
      daily.value = true;
      yearly.value = false;
      clearInterval(interval.value);
      interval.value = setInterval(() => {
        updateData('day');
      }, 86400000);
    };

    const setYearly = () => {
      weekly.value = false;
      daily.value = false;
      yearly.value = true;
      clearInterval(interval.value);
      interval.value = setInterval(() => {
        updateData('year');
      }, 31536000000);
    };

    const updateData = (interval) => {
      const now = new Date();
      const data1 = [];
      const data2 = [];
      const labels = [];
      const hive1Data = data.value.filter((d) => d.name === hive1.value);
      const hive2Data = data.value.filter((d) => d.name === hive2.value);

      if (interval === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 604800000);
        hive1Data.forEach((d) => {
          if (d.date >= oneWeekAgo) {
            data1.push(d.weight);
          }
        });
        hive2Data.forEach((d) => {
          if (d.date >= oneWeekAgo) {
            data2.push(d.weight);
          }
        });
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 86400000);
          labels.push(date.toLocaleDateString());
        }
      } else if (interval === 'day') {
        const oneDayAgo = new Date(now.getTime() - 86400000);
        hive1Data.forEach((d) => {
          if (d.date >= oneDayAgo) {
            data1.push(d.weight);
          }
        });
        hive2Data.forEach((d) => {
          if (d.date >= oneDayAgo) {
            data2.push(d.weight);
          }
        });
        for (let i = 23; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 3600000);
          labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } else if (interval === 'year') {
        const oneYearAgo = new Date(now.getTime() - 31536000000);
        hive1Data.forEach((d) => {
          if (d.date >= oneYearAgo) {
            data1.push(d.weight);
          }
        });
        hive2Data.forEach((d) => {
          if (d.date >= oneYearAgo) {
            data2.push(d.weight);
          }
        });
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 2678400000);
          labels.push(date.toLocaleDateString([], { month: 'short' }));
        }
      }

      chart.value.data.datasets[0].data = data1;
      chart.value.data.datasets[1].data = data2;
      chart.value.data.labels = labels;
      chart.value.update();
    };

    onMounted(() => {
      fetch('/api/hives')
        .then((res) => res.json())
        .then((res) => {
          data.value = res;
          hive1.value = res[0].name;
          hive2.value = res[1].name;
          const hive1Data = res.filter((d) => d.name === hive1.value);
          const hive2Data = res.filter((d) => d.name === hive2.value);
          const labels = [];
          hive1Data.forEach((d) => {
            labels.push(d.date.toLocaleDateString());
          });
          options.value = {
            scales: {
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
            },
          };
          chart.value = new Chart(chartRef.value, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: hive1.value,
                  data: hive1Data.map((d) => d.weight),
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  tension: 0.1,
                },
                {
                  label: hive2.value,
                  data: hive2Data.map((d) => d.weight),
                  borderColor: 'rgba(54, 162, 235, 1)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  tension: 0.1,
                },
              ],
            },
            options: options.value,
          });
          interval.value = setInterval(() => {
            updateData('week');
          }, 604800000);
        });
    });

    return {
      chartRef,
      chart,
      data,
      options,
      interval,
      hive1,
      hive2,
      weekly,
      daily,
      yearly,
      setWeekly,
      setDaily,
      setYearly,
    };
  },
};
</script>

<style>
canvas {
  width: 100%;
  height: 400px;
}
</style>