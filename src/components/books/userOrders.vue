<template>
  <div class="container">
    <h1>Your orders</h1>
    <div>
      <router-link to="/books">Книги</router-link>
      <br>
      <router-link to="/user-orders">Заказы</router-link>
    </div>
    <div class="row">
      <div class="col" v-for="o in state.order">
        <div class="card" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">{{ o.book.name }}</h5>
            <p class="card-text">{{o.book.description}}</p>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Время заказа {{o.order_date}}</li>
              <li v-if="o.book.status_id === 3" class="list-group-item">Время выдачи книги {{o.booking_date}}</li>
              <li v-if="o.book.status_id === 3" class="list-group-item">Дата возвращения {{o.return_date}}</li>
            </ul>
            <p class="card-text text-info" v-if="o.book.status_id === 2">Ваш заказ ещё не подтверждён</p>
            <button type="button"
                    v-if="o.book.status_id === 2"
                    style="float: right"
                    class="btn btn-danger"
                    @click="cancel(o.id, o.book_id,4)">Отменить</button>
          </div>
        </div>
      </div>
    </div>
    <button @click.prevent="logout" class="btn btn-primary mt-3">Выйти</button>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router"
import {onMounted, reactive} from "vue";

const state = reactive({
  userId: '',
  userRole: '',
  order: [],
})

const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}


const userToken = () => localStorage.getItem('token')

const getAuthorizationHeader = () => `Bearer ${userToken()}`;

const user = async () => {
  await axios.get("//localhost:8080/api/api/user", {
    headers: {Authorization: getAuthorizationHeader()},
  })
      .then(response => {
        state.userId = response.data.id
        order()
        // userRole()
      })
      .catch(error => {
        logout()
      })
}


const order = async () => {
  await axios.post('//localhost:8080/api/api/user-orders', {
    user_id: state.userId
  })
      .then(response => {
        state.order = response.data
      })
}

const cancel = async (ido, idb, status) => {
  await axios.delete('//localhost:8080/api/api/orders/' + ido,{
    params: {
      book_id: idb,
      status_id: status
    }
  })
      .then(response => {
      })
      .catch(error => {
      })
  order()
}

onMounted(() => {
  user()
})
</script>