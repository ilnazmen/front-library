<template>
  <div class="container">
    <h2 class="text-center">Укажите вашу почту и мы пришлём вам ссылку для сброса пароля</h2>
    <p class="text-danger" v-if="errored">{{errored}}</p>
    <form @submit.prevent="forgot">
      <div class="form-group mt-3">
        <input type="text" class="form-control mt-3" v-model="state.email" placeholder="email...">
        <div class="input-email" v-for="error of v$.email.$errors" :key="error.$uid">
          <div class="error-msg">{{error.$message}}</div>
        </div>
        <button type="submit" @click.prevent="forgot" class="btn btn-primary mt-3">Сбросить</button>
      </div>
    </form>
    <p v-if="state.status" >{{state.status}}</p>
  </div>
</template>

<script setup>
import {computed, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {email, helpers, minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

let errored = ref('')
const router = useRouter()

const state = reactive({
  email: '',
  status:''
})

const rules = computed(() => {
  return {
    email: {
      required:
          helpers.withMessage("Ну как я тебе пустоe поле отправлю, уебан", required),
      email: helpers.withMessage("Нормально мыло напиши", email),
    }
  }
})

const v$ = useVuelidate(rules, state)

const forgot = async () => {
  const result = await v$.value.$validate();
  if (result) {
    await axios.post('//localhost:8080/api/api/forgot-password', {
      email:state.email
    })
        .then(response => {
          if (response.data) {
            console.log(response)
            state.status = response.data.message
            errored.value = null
          }})
        .catch(error => {
          errored.value = error.response.data.error
        })
  }
 else {alert("Неверно введены данные")}
}
</script>

<style scoped>

</style>