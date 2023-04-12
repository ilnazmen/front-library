<template>
  <div class="container">
    <p class="text-danger" v-if="error">{{error}}</p>
    <form @submit.prevent="login">
      <div class="form-group mt-3">
        <input type="text" class="form-control mt-3" v-model="state.email" placeholder="email...">
        <input type="password" class="form-control mt-3" v-model="state.password" placeholder="password..">
        <button type="submit" @click.prevent="login" class="btn btn-primary mt-3">Добавить</button>
        <button type="submit" @click.prevent="forgot" class="btn btn-primary mt-3 float-end">Забыли пароль?</button>
      </div>
      <div class="alert alert-danger" role="alert" v-if="error">
        pizda
      </div>
    </form>
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
  password:'',
})

const login = async () => {
  await axios.post('//localhost:8080/api/api/login', state)
      .then(response => {
        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token)
          console.log(response.data.role[0].name)
          if (response.data.role[0].name === 'user'){
            router.push('/books')
          }
          else if (response.data.role[0].name === 'writer') {
            router.push('/writer')
          }
          else {
            router.push('/admin')
          }
        }
        else {
          error.value = response.data.message;
        }
      })
}

const forgot = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>

</style>