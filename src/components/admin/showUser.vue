<template>
<div class="container">
  <h1>Сменить данные пользователя</h1>
  <form @submit.prevent="saveUser">
    <div class="form-group">
      <input type="text" class="form-control mt-3" v-model="state.name" placeholder="Имя пользователя" disabled>
      <input type="text" class="form-control mt-3" v-model="state.email" placeholder="Почта пользователя" disabled>
      <input type="text" class="form-control mt-3" v-model="state.password" placeholder="Пароль">
      <input type="text" class="form-control mt-3" v-model="state.c_password" placeholder="Повторите пароль">
      <select class="form-select mt-3" multiple  aria-label="Default select example" v-model="state.role">
        <option v-for="role in state.roles" :value="role.id">{{role.name}}</option>
      </select>
      <button type="submit" @click.prevent="saveUser" class="btn btn-primary mt-3">Изменить значения</button>
    </div>
  </form>
</div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import router from "@/components/router";
const props = defineProps(['userId'])

let errored = ref(false)
const state = reactive({
  roles: [],
  name: '',
  email: '',
  password: '',
  c_password: '',
  role: '',
})

function showRoles() {
  axios.get('//localhost:8080/api/api/roles')
      .then(response => {
        state.roles = response.data

      })
}

function saveUser(){
  axios.put('//localhost:8080/api/api/users/' + props.userId, {
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
        console.log(error);
      })}

function showUser() {
  axios.get('//localhost:8080/api/api/users/' + props.userId)
      .then(response => {
        state.name = response.data.data.name
        state.email = response.data.data.email
        state.password = response.data.data.password
        state.c_password = response.data.data.c_password
        state.role = response.data.data.role.map(value => {
          return value.id
        })
      })
      .catch(error => {
        console.log(error)
        errored.value = true
      })
  showRoles()
}

onMounted( () => {
  showUser()
  showRoles()
})
</script>

<style scoped>

</style>