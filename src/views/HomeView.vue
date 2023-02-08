<script>
import PieChart from '../components/PieChartSvg.vue'
import { useDbConfig } from "../stores/dbConfig";
export default {
  setup() {
    const db = useDbConfig()
    return { db }
  },
  components: {
    "pie-chart": PieChart
  },
  created() {
    this.updatePeriod()
  },
  data() {
    const months = [
      "Januari",
      "Februari",
      "Mars",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "Augusti",
      "September",
      "Oktober",
      "November",
      "December"
    ]
    return {
      months: months,
      month: 2,
      year: new Date().getFullYear(),
      chartData: []
    }

  },
  computed: {
    period() {
      console.log(this.year, this.month)
      let from = new Date(this.year, this.month)
      let to = new Date(new Date(this.year, this.month + 1).setDate(1) - 1)
      return {
        from: `${from.getFullYear()}-${from.getMonth()}-${from.getDate()}`,
        to: `${to.getFullYear()}-${to.getMonth()}-${to.getDate()}`
      }
    },
  },
  methods: {
    updatePeriod() {
      this.db.period = "month:" + this.period.from
      this.db.getQuery("transaction/group/category").then(res => {
        console.log(res)
        debugger
        if (!res) {
          return null
        } else {
          let data = []
          for (let d in res.data) {
            data.push({ label: d, value: res.data[d].amount * -1 })
          }
          console.log("update-period", data)
          this.chartData = data
        }
      })
    },
    getTransactions(from, to) {
      to = to ? to : new Date(new Date().setHours(59, 59, 59))
      from = from ? from : new Date()
    }
  }
}
</script>

<template>
  <header>
    <select v-model="month" @change="updatePeriod()">
      <option v-for="(m, i) in months" :key="m" :value="i">{{ m }}</option>
    </select>
    <select v-model="year" @change="updatePeriod()">
      <option value="2020">2020</option>
      <option value="2021">2021</option>
      <option value="2022">2022</option>
      <option value="2023">2023</option>
    </select>
  </header>
  <main>
    <pie-chart :_data="chartData" :key="chartData[0]"></pie-chart>
  </main>
</template>
