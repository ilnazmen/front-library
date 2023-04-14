<template>
  <div class="container">
  <h1>Welcome admin</h1>
  <div>
    <router-link to="/books">Книги</router-link>
    <br>
    <router-link to="/admin/books">Добавление книг</router-link>
    <br>
    <router-link to="/users">Редактирование пользователей</router-link>
  </div>
  <button  @click.prevent="logout" class="btn btn-primary mt-3">Выйти</button>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router"
import {onMounted, reactive} from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, minLength } from '@vuelidate/validators'

const state = reactive({
  userId: '',
  userRole: ''
})

const router = useRouter()
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

      })
}


onMounted( () => {
user()
})
</script>