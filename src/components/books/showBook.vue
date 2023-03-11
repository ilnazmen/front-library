<template>
  <div class="container">
    <div class="form-group mt-3">
      <input type="text" @blur="form" v-model="state.name" name="name" class="form-control" :class="{ 'is-invalid': validator.name.$errors?.length }">
      <div class="invalid-feedback" >
        {{ validator.name.$errors?.[0]?.$message }}
      </div>

<!--      <div class="invalid-feedback">-->
<!--        Макс количество символов:-->
<!--      </div>-->
    </div>
    <div class="alert alert-danger" role="alert" v-if="errored">
      pizda
    </div>
    <div class="spinner-border" role="status" v-if="loading">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import data from "bootstrap/js/src/dom/data";
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength} from '@vuelidate/validators'
import {computed, onMounted, reactive, ref} from "vue";

const props = defineProps(['bookId'])

// const bookForm = reactive({
//   name: '',
// })

const errored = ref(false)
const loading = ref(true)

const state = reactive({
  name: '',
})

const rules = {
  name: {
    required,
    maxLength: maxLength(20)
  }
}
const validator = useVuelidate(rules, state)

const form = async () => {
  const result = await validator.value.$validate();

  if (result){
    savename()
  } else {
    alert("hui")
  }
}

function savename(){
  axios.put('//localhost:8080/api/api/books/' + props.bookId, {
    name: state.name
  })
      .then(response => {

      })
      .catch(error => {
        console.log(error)
        errored.value = true
      })
      .finally( () => {
        loading.value = false
      })
}

onMounted(() => {
  axios.get('//localhost:8080/api/api/books/' + props.bookId)
      .then(response => {
        state.name = response.data.data.name
      })
      .catch(error => {
        console.log(error)
        errored.value = true
      })
      .finally( () => {
        loading.value = false
      })
})

</script>

<style lang="scss" scoped>

</style>