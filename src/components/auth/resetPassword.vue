<template>
  <div class="container">
    <p class="text-danger" v-if="errored">{{errored}}</p>
    <h2>Укажите вашу почту и новый пароль</h2>
    <form @submit.prevent="reset">
      <div class="form-group mt-3">
        <input type="text" class="form-control mt-3" v-model="state.email" placeholder="email...">
        <div class="input-email" v-for="error of v$.email.$errors" :key="error.$uid">
          <div class="error-msg">{{error.$message}}</div>
        </div>
        <input type="password" class="form-control mt-3" v-model="state.password" placeholder="новый пароль...">
        <div class="input-email" v-for="error of v$.password.$errors" :key="error.$uid">
          <div class="error-msg">{{error.$message}}</div>
        </div>
        <input type="password" class="form-control mt-3" v-model="state.password_c" placeholder="повторите новый пароль...">
        <div class="input-email" v-for="error of v$.password_c.$errors" :key="error.$uid">
          <div class="error-msg">{{error.$message}}</div>
        </div>
        <button type="submit" @click.prevent="reset" class="btn btn-primary mt-3">Добавить</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import {email, helpers, minLength, required, sameAs} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";


let errored = ref(false)
const route = useRoute()
const router = useRouter();


const state = reactive({
  email: '',
  password: '',
  password_c: ''
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
    },
    password_c: {
      required: helpers.withMessage("Ну как я тебе пустоe поле отправлю, уебан", required),
      minLength: helpers.withMessage("Короткий", minLength(8)),
      sameAs: helpers.withMessage("Пароли должны совпадать", sameAs(state.password))
    }
  }
})

const v$ = useVuelidate(rules, state)
const reset = async () => {
  const result = await v$.value.$validate();
  if (result) {
    await axios.post('//localhost:8080/api/api/reset-password', {
      email: state.email,
      password: state.password,
      password_confirmation: state.password_c,
      token: route.params.token
    })
        .then(response => {
            alert("Ваш пароль успешно изменён")
            router.push('/login')
        })
        .catch(error => {
          errored.value = error.response.data.error
          console.log(errored)
        })
  }
  else {alert("Данные введены неккоректно")}
}
</script>

<style scoped>

</style>