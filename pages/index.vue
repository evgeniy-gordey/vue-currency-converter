<template>
  <section class="main-page">
    <div class="main-page__container">
      <currency-converter />
      <h1 class="main-page__title">
        Vue-currency-converter
      </h1>
      <div class="main-page__subtitle">
        Simple currency modal converter for Vue.js
      </div>
      <div class="main-page__lorem-ipsum">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </div>
      <div class="main-page__button-wrapper">
        <button
          class="main-page__button button button-lg button-filled button-shadow"
          @click="openModal()">Open converter</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CurrencyConverter from '~/components/CurrencyConverter.vue'

export default {
  components: {
    CurrencyConverter
  },
  async fetch ({ store: { dispatch } }) {
    await dispatch('getRates');
  },
  computed: mapGetters(['isModalOpened']),
  methods: mapMutations(['openModal', 'closeModal'])
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/buttons';

  .main-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;

    &__container {
      display: flex;
      max-width: 1000px;
      flex-direction: column;
      padding: 20px;
    }

    &__title {
      display: flex;
      text-align: center;
      justify-content: center;
      font-size: 36px;
      margin-top: 40px;
    }

    &__subtitle {
      display: flex;
      text-align: center;
      justify-content: center;
      font-size: 20px;
      padding: 20px 0;
      margin-bottom: 40px;
    }

    &__lorem-ipsum {
      display: flex;
      font-size: 16px;
      line-height: 1.5;
      padding: 20px 0;
    }

    &__button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
  }
</style>
