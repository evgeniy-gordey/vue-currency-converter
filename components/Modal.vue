<template>
  <div
    v-if="isModalOpened"
    class="modal"
    @click="closeModal()">
    <div
      class="modal__container"
      @click.stop>
      <slot />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Modal',
  computed: mapGetters(['isModalOpened']),
  methods: mapMutations(['closeModal'])
}
</script>

<style lang="scss" scoped>
  @import 'assets/scss/buttons';
  @import 'assets/scss/mixins';

  .modal {
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
    transition: opacity .3s ease;

    @include breakpoint(phone) {
      padding: 10% 0;
    }

    &__container {
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
  }

</style>
