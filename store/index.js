import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      isModalOpened: false,
      rates: {}
    },
    mutations: {
      openModal (state) {
        state.isModalOpened = true
        document.body.className = 'modal-opened'
      },
      closeModal (state) {
        state.isModalOpened = false
        document.body.className = ''
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

        //UPD: иммитация запросов к сторонним API
        const response1 = {
          rates: {
            USD: 1.1402,
            RUB: 75.6267
          },
          base: "EUR",
          date: "2019-01-18"
        }
        const response2 = {
          rates: {
            RUB: 66.3275741098,
            EUR: 0.8770391159
          },
          base: "USD",
          date: "2019-01-18"
        }
        const response3 = {
          rates: {
            USD: 0.0150766859,
            EUR: 0.0132228433
          },
          base: "RUB",
          date: "2019-01-18"
        }

        commit('setRates', {EUR: response1.rates, USD: response2.rates, RUB: response3.rates})
      }
    },
    getters: {
      isModalOpened: state => state.isModalOpened
    }
  })
}

export default createStore
