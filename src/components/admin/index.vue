<template>
  <h1>Welcome admin</h1>
  <div>
    <router-link to="/">index</router-link>
    <br>
    <router-link to="/books">Добавление книг</router-link>
    <br>
    <router-link to="/users">Редактирование пользователей</router-link>
  </div>
  <button  @click.prevent="logout" class="btn btn-primary mt-3">Выйти</button>
</template>

<script setup>
import {useRouter} from "vue-router"

const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

</script>