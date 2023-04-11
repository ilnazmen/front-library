<template>
  <div class="container">
    <p class="text-danger" v-if="error">{{error}}</p>
    <form @submit.prevent="reset">
      <div class="form-group mt-3">
        <input type="text" class="form-control mt-3" v-model="state.email" placeholder="email...">
        <button type="submit" @click.prevent="reset" class="btn btn-primary mt-3">Добавить</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {email} from "@vuelidate/validators";

let error = ref('')
const router = useRouter()

const state = reactive({
  email: '',
})

const reset = async () => {
  await axios.post('//localhost:8080/api/api/reset-password', state)
      .then(response => {
        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token)
          router.push('/admin')
        }
        else {
          error.value = response.data.message;
        }
      })
}
 onMounted( () => {

 })

</script>

<style scoped>

</style>