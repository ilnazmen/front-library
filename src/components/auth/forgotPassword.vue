<template>
  <div class="container">
    <p class="text-danger" v-if="error">{{error}}</p>
    <form @submit.prevent="forgot">
      <div class="form-group mt-3">
        <input type="text" class="form-control mt-3" v-model="state.email" placeholder="email...">
        <button type="submit" @click.prevent="forgot" class="btn btn-primary mt-3">Сбросить</button>
      </div>
    </form>
    <p v-if="state.status" >{{state.status}}</p>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {email} from "@vuelidate/validators";

let error = ref('')
const router = useRouter()

const state = reactive({
  email: '',
  status:''
})

const forgot = async () => {
  await axios.post('//localhost:8080/api/api/forgot-password', {
    email:state.email
  })
      .then(response => {
        if (response.data)
          state.status = response.data
          // localStorage.setItem('token', response.data.data.token)
          // router.push('/admin')

        else {
          error.value = response.data.message;
        }
      })
}
</script>

<style scoped>

</style>