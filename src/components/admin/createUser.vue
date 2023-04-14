<template>
  <div class="container">
    <h1>Добавить пользователя</h1>
    <form @submit.prevent="addUser">
      <div class="form-group">
        <input type="text" class="form-control mt-3" v-model="state.name" placeholder="Имя пользователя">
        <input type="text" class="form-control mt-3" v-model="state.email" placeholder="Почта пользователя">
        <input type="password" class="form-control mt-3" v-model="state.password" placeholder="Пароль">
        <input type="password" class="form-control mt-3" v-model="state.c_password" placeholder="Повторите пароль">
        <select class="form-select mt-3"  aria-label="Default select example" v-model="state.role">
          <option v-for="role in state.roles" :value="role.id">{{ role.name }}</option>
        </select>
        <button type="submit" @click.prevent="addUser" class="btn btn-primary mt-3">Добавить</button>
        <div class="alert alert-danger" role="alert" v-if="errored">
          <div v-for="error in errored"><li>{{error[0]}}</li></div>
        </div>
        <div class="spinner-border" role="status" v-if="loading">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </form>
    <div class="row">
      <div class="col-6" v-for="user in state.users">
        <div class="card mt-3">
          <router-link class="card-body" :to="{name: 'showUser', params: {userId: user.id}}">
            <h5 class="card-title">{{user.name}}</h5>
            <p class="card-text">{{user.email}}</p>
            <p class="card-text">{{user.password}}</p>
            <ul v-for="value in user.role">
              <li>{{value.title}}</li>
            </ul>
          </router-link>
          <button type="button" class="btn btn-danger" @click="deleteUser(user.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

let errored = ref(false)
let loading = ref(true)
const state = reactive({
  users: [],
  roles: [],
  name: '',
  email: '',
  password: '',
  c_password: '',
  role: '',
})

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
function showUsers(){
  axios.get('//localhost:8080/api/api/users')
      .then(response => {
        state.users = response.data.data
      })
      .catch(error => {
        console.log(error)
        errored.value = true
      })
}
onMounted(() => {
  showUsers()
  showRoles()
  user()
  loading.value = false
})
function addUser() {
  axios.post("//localhost:8080/api/api/users", {
    name: state.name,
    email: state.email,
    password: state.password,
    c_password: state.c_password,
    role: state.role
  })
      .then(function (response) {
        state.name = ''
        state.email = ''
        state.password = ''
        state.c_password = ''
        state.role = ''
        showUsers()
      })
      .catch(function (error) {
        errored.value = error.response.data?.message
      })}
function deleteUser(id) {
  axios.delete('//localhost:8080/api/api/users/' + id)
      .then(response => {
        state.users = []
        showUsers()
      })
      .catch(error => {
        errored.value = error.response.data?.message
      })
}
</script>

<style scoped>

</style>