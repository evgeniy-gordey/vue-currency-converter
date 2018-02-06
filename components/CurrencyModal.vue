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
            value="0"
            class="currency-modal__input"
            :class="{'currency-modal__input-active': activeInput == 'value'}"
            @click="activeInput = 'value'"
            @input="calculate()"
            ref="value">
          <div class="currency-modal__rate">1 {{ cur1 }} = {{ rates[cur1][cur2] }} {{ cur2 }}</div>
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
            value="0"
            class="currency-modal__input"
            :class="{'currency-modal__input-active': activeInput == 'total'}"
            @click="activeInput = 'total'"
            @input="calculate()"
            ref="total">
          <div class="currency-modal__rate">1 {{ cur2 }} = {{ rates[cur2][cur1] }} {{ cur1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'CurrencyModal',
    data() {
        return {
            value: '0',
            total: '0',
            cur1: 'EUR',
            cur2: 'USD',
            activeInput: 'value'
        }
    },
    computed: {
      ...mapState({
        rates: state => state.rates
      })
    },
    mounted() {
      setInterval(() => {
        this.$store.dispatch('getRates')
      }, 15000)
    },
    methods: {
      validate(type) {
        let oldValue = this[type]
        let temp  = this.$refs[type].value

        // Replace ',' to '.' (12,4 => 12.4)
        temp = temp.replace( /,/g, "." )

        // Truncate leading '0'
        temp = temp.replace(/^0+(?!\.|$)/, '')

        if (temp[0] == '.') {
          temp = '0.' + temp.substring(1)
        }

        if ((/^\d+[.]?\d*$/g.test(temp)) || temp == '') {
          this[type] = temp
        } else {
          this[type] = oldValue
        }
      },
      calculate() {
        this.validate(this.activeInput)

        if (this.activeInput == 'value') {
          this.$refs.value.value = this.value
          this.total = this.$refs.total.value = +(this.value * this.rates[this.cur1][this.cur2]).toFixed(3)
        } else {
          this.$refs.total.value = this.total
          this.value = this.$refs.value.value = +(this.total / this.rates[this.cur1][this.cur2]).toFixed(3)
        }
      },
      changeCurrencies() {
        [this.cur1, this.cur2] = [this.cur2, this.cur1]
        this.calculate(this.activeInput)
      }
    }
}

</script>

<style lang="scss" scoped>
  @import 'assets/scss/buttons';
  @import 'assets/scss/mixins';

    .currency-modal {
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
            display: flex;
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
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;

            @include breakpoint(phone) {
              flex-direction: column;
            }
        }

        &__input {
          min-width: 200px;
          font-size: 20px;
          box-shadow: none;
          border-radius: 4px;
          outline: none;
          padding: 7px 5px;
          border: 1px solid #cecece;

          &-active {
            border: 1px solid #42b983;
            box-shadow: 0 0 0 1px rgba(27,74,53,.1), 0 2px 5px 0 rgba(27,74,53,.08),
                        0 1px 1.5px 0 rgba(0,0,0,.07), 0 1px 2px 0 rgba(0,0,0,.08),
                        0 0 0 0 transparent;
          }
        }

        &__buttons {
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
