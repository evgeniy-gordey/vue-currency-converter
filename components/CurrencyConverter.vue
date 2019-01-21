<template>
  <modal>
    <div class="currency-converter__main">
      <div class="currency-converter__input-wrapper">
        <div class="currency-converter__buttons">
          <button
            :class="{'button-filled': cur1 == 'EUR', 'button-transparent': cur1 != 'EUR'}"
            class="button"
            @click="cur1 = 'EUR'; calculate()">EUR</button>
          <button
            :class="{'button-filled': cur1 == 'USD', 'button-transparent': cur1 != 'USD'}"
            class="button"
            @click="cur1 = 'USD'; calculate()">USD</button>
          <button
            :class="{'button-filled': cur1 == 'RUB', 'button-transparent': cur1 != 'RUB'}"
            class="button"
            @click="cur1 = 'RUB'; calculate()">RUB</button>
        </div>
        <input
          ref="val1"
          :class="{'currency-converter__input-active': activeInput == 'val1'}"
          type="text"
          value="0"
          class="currency-converter__input"
          @focus="activeInput = 'val1'"
          @input="calculate()">
        <div class="currency-converter__rate">1 {{ cur1 }} = {{ rates[cur1][cur2] }} {{ cur2 }}</div>
      </div>
      <div class="currency-converter__arrows-wrapper">
        <div
          class="currency-converter__arrows"
          @click="changeCurrencies" />
      </div>
      <div class="currency-converter__input-wrapper">
        <div class="currency-converter__buttons">
          <button
            :class="{'button-filled': cur2 == 'EUR', 'button-transparent': cur2 != 'EUR'}"
            class="button"
            @click="cur2 = 'EUR'; calculate()">EUR</button>
          <button
            :class="{'button-filled': cur2 == 'USD', 'button-transparent': cur2 != 'USD'}"
            class="button"
            @click="cur2 = 'USD'; calculate()">USD</button>
          <button
            :class="{'button-filled': cur2 == 'RUB', 'button-transparent': cur2 != 'RUB'}"
            class="button"
            @click="cur2 = 'RUB'; calculate()">RUB</button>
        </div>
        <input
          ref="val2"
          :class="{'currency-converter__input-active': activeInput == 'val2'}"
          type="text"
          value="0"
          class="currency-converter__input"
          @focus="activeInput = 'val2'"
          @input="calculate()">
        <div class="currency-converter__rate">1 {{ cur2 }} = {{ rates[cur2][cur1] }} {{ cur1 }}</div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex'
import Modal from '~/components/Modal.vue'

export default {
    name: 'CurrencyConverter',
    components: {
      Modal
    },
    data() {
        return {
            val1: '0',
            val2: '0',
            cur1: 'EUR',
            cur2: 'USD',
            activeInput: 'val1'
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

        if (this.activeInput == 'val1') {
          this.$refs.val1.value = this.val1
          this.val2 = this.$refs.val2.value = +(this.val1 * this.rates[this.cur1][this.cur2]).toFixed(3)
        } else {
          this.$refs.val2.value = this.val2
          this.val1 = this.$refs.val1.value = +(this.val2 / this.rates[this.cur1][this.cur2]).toFixed(3)
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

    .currency-converter {

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
