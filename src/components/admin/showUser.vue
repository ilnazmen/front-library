<template>
<div class="container">
  <h1>Сменить данные пользователя</h1>
  <form @submit.prevent="addUser">
    <div class="form-group">
      <input type="text" class="form-control mt-3" v-model="state.name" placeholder="Имя пользователя">
      <input type="text" class="form-control mt-3" v-model="state.email" placeholder="Почта пользователя">
      <input type="text" class="form-control mt-3" v-model="state.password" placeholder="Пароль">
      <input type="text" class="form-control mt-3" v-model="state.c_password" placeholder="Повторите пароль">
      <select class="form-select mt-3" aria-label="Default select example" v-model="state.role">
        <option v-for="role in state.roles" :value="role.value">{{ role.name }}</option>
      </select>
      <button type="submit" @click.prevent="addUser" class="btn btn-primary mt-3">Добавить</button>
    </div>
  </form>
</div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
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