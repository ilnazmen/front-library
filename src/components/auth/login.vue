<template>
  <div class="container">
    <p class="text-danger" v-if="error">{{error}}</p>
    <form @submit.prevent="login">
      <div class="form-group mt-3">
        <input type="text"
               class="form-control mt-3"
               v-model="state.email"
               placeholder="email...">
        <div class="input-email" v-for="error of v$.email.$errors" :key="error.$uid">
        <div class="error-msg">{{error.$message}}</div>
        </div>
        <input type="password"
               class="form-control mt-3"
               v-model="state.password"
               placeholder="password..">
        <div class="input-password" v-for="error of v$.password.$errors">
        <div class="error-msg">{{error.$message}}</div>
        </div>
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
import {computed, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {email, helpers, minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

let error = ref('')
const router = useRouter()

const state = reactive({
  email: '',
  password:'',
})
const rules = computed(() => {
  return {
    email: {
      required:
          helpers.withMessage("Ну как я тебе пустоe поле отправлю, уебан", required),
      minLength: helpers.withMessage("Короткий", minLength(10)),
      email: helpers.withMessage("Нормально мыло напиши", email),
    },
    password: {
      required: helpers.withMessage("Ну как я тебе пустоe поле отправлю, уебан", required),
      minLength: helpers.withMessage("Короткий", minLength(8)),
    }
  }
})

const v$ = useVuelidate(rules, state)

const login = async () => {
  const result = await v$.value.$validate();
    if (result) {
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
  else {
    alert("Даныые введены не корректно")
    }
}

const forgot = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>

</style>