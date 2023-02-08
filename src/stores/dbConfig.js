import { defineStore } from 'pinia'
import { dbUrl } from '../db.config'
export const useDbConfig = defineStore('counter', {
  state() {
    return {
      count: 0,
      url: dbUrl,
      categories: [],
      accounts: [],
      schemas: [],
      period: "",
      type: "expence"
    }
  },
  getters: {
    doubleCount(store) {
      return store.count * 2
    },
    amount(store) {
      return store.type == "expence" ? "amount=<0" : "amount=>0"
    }
  },
  actions: {
    getQuery(path, query = {}) {
      return new Promise(res => {
        let q = ""
        for (let x in query) {
          q += "&" + x + "=" + query[x]
        }
        fetch(`${this.url}${path}?${this.amount}${q}&date=${this.period}`).then(res => res.text()).then(data => {
          res(JSON.parse(data))
        })
      })
    }
  }
})
