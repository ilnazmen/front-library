<template>
  <VueDatePicker v-model="date" locale="ru" :enable-time-picker="false"></VueDatePicker>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: { VueDatePicker },
  data() {
    return {
      date: null,
    };
  }
}
</script>



<style lang="scss" scoped>

</style>