import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      isCurrencyModalOpened: false,
      rates: {}
    },
    mutations: {
      triggerCurrencyModal (state, bool) {
        bool ? state.isCurrencyModalOpened = true : state.isCurrencyModalOpened = false
      },
      setRates (state, data) {
        state.rates = data
        // Курс данной валюты к самой себе равен 1
        state.rates.EUR.EUR = 1
        state.rates.USD.USD = 1
        state.rates.RUB.RUB = 1
      }
    },
    actions: {
      async getRates ({ commit }) {
        // Для оптимизации количества запросов клиента к серверу, необходимо писать серерную часть,
        // отдающую данные в удобном для обработки на клиентской стороне виде
        // Тогда вместо 3-х запросов, можно будет обойтись одним
        // Для тестового задания были взяты сторонние api
        const response1 = await axios.get('https://api.fixer.io/latest?symbols=USD,RUB')
        const response2 = await axios.get('https://api.fixer.io/latest?base=USD&symbols=EUR,RUB')
        const response3 = await axios.get('https://api.fixer.io/latest?base=RUB&symbols=EUR,USD')
        commit('setRates', {EUR: response1.data.rates, USD: response2.data.rates, RUB: response3.data.rates})
      }
    }
  })
}

export default createStore
