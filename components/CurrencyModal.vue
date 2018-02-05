<template>
  <div
    class="currency-modal"
    @click="$emit('close')">
    <div
      class="currency-modal__wrapper"
      @click.stop>
      <div class="currency-modal__main">
        <div class="currency-modal__left">
          <div class="currency-modal__buttons">
            <button
              class="button"
              :class="{'button-filled': cur1 == 'EUR', 'button-transparent': cur1 != 'EUR'}"
              @click="cur1 = 'EUR'; calculate()">EUR</button>
            <button
              class="button"
              :class="{'button-filled': cur1 == 'USD', 'button-transparent': cur1 != 'USD'}"
              @click="cur1 = 'USD'; calculate()">USD</button>
            <button
              class="button"
              :class="{'button-filled': cur1 == 'RUB', 'button-transparent': cur1 != 'RUB'}"
              @click="cur1 = 'RUB'; calculate()">RUB</button>
          </div>
          <input
            type="text"
            class="currency-modal__input"
            v-model="value"
            @input="calculate"
            @paste="calculate">
          <div class="currency-modal__rate">1 {{ cur1 }} = {{ $store.state.rates[cur1][cur2] }} {{ cur2 }}</div>
        </div>
        <div class="currency-modal__arrows-wrapper">
          <div
            class="currency-modal__arrows"
            @click="changeCurrencies" />
        </div>
        <div class="currency-modal__right">
          <div class="currency-modal__buttons">
            <button
              class="button"
              :class="{'button-filled': cur2 == 'EUR', 'button-transparent': cur2 != 'EUR'}"
              @click="cur2 = 'EUR'; calculate()">EUR</button>
            <button
              class="button"
              :class="{'button-filled': cur2 == 'USD', 'button-transparent': cur2 != 'USD'}"
              @click="cur2 = 'USD'; calculate()">USD</button>
            <button
              class="button"
              :class="{'button-filled': cur2 == 'RUB', 'button-transparent': cur2 != 'RUB'}"
              @click="cur2 = 'RUB'; calculate()">RUB</button>
          </div>
          <input
            type="text"
            class="currency-modal__input"
            v-model="total"
            @input="calculateReverse"
            @paste="calculateReverse">
          <div class="currency-modal__rate">1 {{ cur2 }} = {{ $store.state.rates[cur2][cur1] }} {{ cur1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '~/store';
import round from 'vue-round-filter';

export default {
    name: 'CurrencyModal',
    filters: {
      round
    },
    data() {
        return {
            value: '0',
            total: '0',
            cur1: 'EUR',
            cur2: 'USD'
        }
    },
    mounted() {
      setInterval(() => {
        this.$store.dispatch('getRates')
      }, 15000)
    },
    methods: {
      validate(event) {
        // Валидация при вставке значения в инпут из клипборда
        if (event.clipboardData) {
          event.preventDefault()

          // Временная перемеренная для хранения результата this.value
          // после вставки строки из клипборда.
          let clipboard = this.value + event.clipboardData.getData('text')

          // Замена всех запятых в строке на точки (10,6 => 10.6)
          clipboard = clipboard.replace( /,/g, "." )

          // Замена точки в начале строки на '0.' (.123 => 0.123)
          if (clipboard[0] == '.') {
            clipboard = '0.' + clipboard.substring(1)
          }

          if (/^\d+[.,]?\d*$/g.test(clipboard)) {
            this.value = clipboard
          }
        // Валидация значений, печатающихся с клавиатуры.
        // Функция вызывается при вводе каждого нового символа
        } else {
          // // Замена первой точки или запятой в начале строки на '0.' (.27 => 0.27)
          if ((this.value[0] == '.') || (this.value[0] == ',')){
            this.value = '0.'
          }

          // Удаление лишних нулей в начале строки (00.123 => 0.123)
          if ((this.value[0] == 0) && (this.value[1] == 0)) {
            this.value = this.value.slice(0, -1)
          }

          // Замена запятой в строке на точку (15,4 => 15.4)
          if (this.value.slice(-1) == ',') {
            this.value = this.value.slice(0, -1) + '.'
          }

          if (!/^\d+[.,]?\d*$/g.test(this.value)) {
            this.value = this.value.slice(0, -1)
          }

          // Удаление лишних нулей в начале строки (00 => 0)
          if ((this.value.length > 1) && (this.value[0] == 0)
              && (this.value[1] != 0) && this.value[1] != '.'
              && (this.value[1] != ',')) {
            this.value = this.value.substring(1)
          }
        }
      },
      validateReverse(event) {
        // Обратная валидация, вызывается при изменении правого инпута
        if (event.clipboardData) {
          event.preventDefault()

          let clipboard = this.total + event.clipboardData.getData('text')

          clipboard = clipboard.replace( /,/g, "." )

          if (clipboard[0] == '.') {
            clipboard = '0.' + clipboard.substring(1)
          }

          if (/^\d+[.,]?\d*$/g.test(clipboard)) {
            this.total = clipboard
          }
        } else {
          if ((this.total[0] == '.') || (this.total[0] == ',')){
            this.total = '0.'
          }
          if ((this.total[0] == 0) && (this.total[1] == 0)) {
            this.total = this.total.slice(0, -1)
          }
          if (this.total.slice(-1) == ',') {
            this.total = this.total.slice(0, -1) + '.'
          }
          if (!/^\d+[.,]?\d*$/g.test(this.total)) {
            this.total = this.total.slice(0, -1)
          }
          if ((this.total.length > 1) && (this.total[0] == 0) && (this.total[1] != 0)
          && this.total[1] != '.' && (this.total[1] != ',')) {
            this.total = this.total.substring(1)
          }
        }
      },
      calculate(event) {
        if (event) {
          this.validate(event)
        }
        this.value != NaN ? this.total = this.value * this.$store.state.rates[this.cur1][this.cur2] : false
        this.total = round(this.total, 3)
      },
      calculateReverse(event) {
        if (event) {
          this.validateReverse(event)
        }
        this.total != NaN ? this.value = this.total / this.$store.state.rates[this.cur1][this.cur2] : false
        this.value = round(this.value, 3)
      },
      changeCurrencies() {
        [this.cur1, this.cur2] = [this.cur2, this.cur1]
        this.calculate()
      }
    }
}

</script>

<style lang="scss">
  @import 'assets/scss/buttons';
  @import 'assets/scss/mixins';

    .currency-modal {
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        justify-content: center;
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        min-height: 100vh;
        padding-top: 200px;
        background-color: rgba(0, 0, 0, .75);
        display: table;
        transition: opacity .3s ease;

        @include breakpoint(phone) {
          padding: 10% 0;
        }

        &__wrapper {
            display: -webkit-flex;
            display: -ms-flex;
            display: flex;
            -ms-align-items: center;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 300px;
            width: 700px;
            min-width: 300px;
            min-height: 300px;
            margin: 0px auto;
            padding: 20px 30px;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
            transition: all .3s ease;
            font-family: Helvetica, Arial, sans-serif;

            @include breakpoint(tablet) {
              width: 580px;
              padding: 10px 15px;
            }

            @include breakpoint(phone) {
              width: 300px;
              height: 370px;
            }
        }

        &__main {
            display: -webkit-flex;
            display: -ms-flex;
            display: flex;
            -ms-align-items: center;
            align-items: center;
            justify-content: center;
            padding: 20px;

            @include breakpoint(phone) {
              -webkit-flex-direction: column;
              -ms-flex-direction: column;
              flex-direction: column;
            }
        }

        &__input {
          min-width: 200px;
          font-size: 20px;
          -webkit-box-shadow: none;
          box-shadow: none;
          border-radius: 4px;
          outline: none;
          padding: 7px 5px;
          border: 1px solid #cecece;
        }

        &__buttons {
          display: -webkit-flex;
          display: -ms-flex;
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        &__arrows {
          &-wrapper {
            height: 50px;
            width: 110px;
            padding: 10px 40px;

            @include breakpoint(tablet) {
              padding: 10px 15px;
            }

            @include breakpoint(phone) {
              padding: 20px;
              height: 90px;
            }
          }

          background: url(https://s.rbk.ru/v5_cash_static/v1.4.63/styles/images/transfer.svg);
          background-repeat: no-repeat;
          background-position: center;
          background-size: 30px;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        &__rate {
          margin-top: 10px;
          color: #666;
        }
    }
</style>
