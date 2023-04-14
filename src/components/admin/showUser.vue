<template>
<div class="container">
  <h1>Сменить данные пользователя</h1>
  <form @submit.prevent="saveUser">
    <div class="form-group">
      <input type="text" class="form-control mt-3" v-model="state.name" placeholder="Имя пользователя" disabled>
      <input type="text" class="form-control mt-3" v-model="state.email" placeholder="Почта пользователя" disabled>
      <input type="text" class="form-control mt-3" v-model="state.password" placeholder="Пароль">
      <div class="input-email" v-for="error of v$.password.$errors" :key="error.$uid">
        <div class="error-msg">{{error.$message}}</div>
      </div>
      <input type="text" class="form-control mt-3" v-model="state.c_password" placeholder="Повторите пароль">
      <div class="input-email" v-for="error of v$.c_password.$errors" :key="error.$uid">
        <div class="error-msg">{{error.$message}}</div>
      </div>
      <select class="form-select mt-3" multiple  aria-label="Default select example" v-model="state.role">
        <option v-for="role in state.roles" :value="role.id">{{role.name}}</option>
      </select>
      <button type="submit" @click.prevent="saveUser" class="btn btn-primary mt-3">Изменить значения</button>
      <div class="alert alert-danger" role="alert" v-if="errored">
        <div v-for="error in errored"><li>{{error[0]}}</li></div>
      </div>
    </div>
  </form>
</div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import router from "@/components/router";
const props = defineProps(['userId']);
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, sameAs } from '@vuelidate/validators'

let errored = ref(false)
const state = reactive({
  roles: [],
  name: '',
  email: '',
  password: '',
  c_password: '',
  role: '',
})
const rules = computed(() => {
  return {
    password: {
      required:
          helpers.withMessage("Ну как я тебе пустоe поле отправлю, уебан", required),
      minLength: helpers.withMessage( "Пароль слишком короткий", minLength(8)),
    },
    c_password: {
      required:
          helpers.withMessage("Ну как я тебе пустоe поле отправлю, уебан", required),
      sameAs: helpers.withMessage("Пароли должны совпадать", sameAs(state.password))
    }
  }
})

const v$ = useVuelidate(rules, state)

const logout =  () => {
  localStorage.removeItem('token')
  router.push('/')
}

const userToken = () => localStorage.getItem('token')

const getAuthorizationHeader = () => `Bearer ${userToken()}`;

const user = async () => {
  await axios.get("//localhost:8080/api/api/user", {
    headers: { Authorization: getAuthorizationHeader() },
  })
      .then(response => {
        state.userId = response.data.id
        userRole()
      })
      .catch(error => {
        logout()
      })
}

const userRole = async () => {
  console.log(state.userId)
  await axios.get('//localhost:8080/api/api/users/' + state.userId)
      .then(response => {
        state.userRole = response.data.data.role.map(value => {
          return value.title
        })
        if (state.userRole != "admin") {
          router.push("/books")
        }
      })
      .catch(error => {
        logout()
      })
}

function showRoles() {
  axios.get('//localhost:8080/api/api/roles')
      .then(response => {
        state.roles = response.data
      })
}

async function saveUser(){
  const rules = await v$.value.$validate();
  if (rules) {
    await axios.put('//localhost:8080/api/api/users/' + props.userId, {
      name: state.name,
      email: state.email,
      password: state.password,
      c_password: state.c_password,
      role: state.role
    })
        .then(function (response) {
          router.push('/users')

        })
        .catch(function (error) {
          errored.value = error.response.data?.message
        })
  }
  else {alert("Данные введены неверно")}
  }

function showUser() {
  axios.get('//localhost:8080/api/api/users/' + props.userId)
      .then(response => {
        state.name = response.data.data.name
        state.email = response.data.data.email
        state.role = response.data.data.role.map(value => {
          return value.id
        })
      })
      .catch(error => {
        errored.value = error.response.data?.message
      })
  showRoles()
}

onMounted( () => {
  showUser()
  showRoles()
  user()
})
</script>

<style scoped>

</style>