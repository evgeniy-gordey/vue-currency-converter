<template>
  <button
    :class="activeCurrency == name ? 'button-filled' : 'button-transparent'"
    class="currency-button button">
    {{ name }}
  </button>
</template>

<script>
export default {
  name: 'CurrencyButton',
  props: {
    name: {
      type: String,
      default: 'EUR'
    },
    activeCurrency: {
      type: String,
      default: 'EUR'
    }
  }
}
</script>

<style lang="scss">
  @import 'assets/scss/buttons';
</style>
