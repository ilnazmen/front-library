<template>
  <div class="container">
  <h1>Welcome writer</h1>
    <div class="row">
      <div class="col-4" v-for="order in state.orders">
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" :src="order.image" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">{{order.book_id.name}}</h5>
        <p class="card-text">{{order.book_id.description}}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">{{order.user_id.name}}</li>
        <li class="list-group-item">{{order.order_date}}</li>
        <li class="list-group-item">{{order.status.title}}</li>
      </ul>
      <div class="card-body">
        <button type="button" class="btn btn-primary" @click="order">Подтвердить</button>
        <button type="button" style="float: right" class="btn btn-danger" @click="">Отменить</button>
      </div>
    </div>
        <modal v-model:show="modalVisible">
          <p>Вы уверены, что хотите заказать эту книгу?</p>
          <button type="button" class="btn btn-primary" @click="orderBook">Заказать</button>
        </modal>
      </div>
    </div>
    <button  @click.prevent="logout" class="btn btn-primary mt-3">Выйти</button>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router"
import {onMounted, reactive} from "vue";
import Modal from "@/components/books/modal.vue";

const state = reactive({
  userId: '',
  userRole: '',
  orders: [],
  modalVisible: false,
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
        console.log(error)
      })
}

const userRole = async () => {
  await axios.get('//localhost:8080/api/api/users/' + state.userId)
      .then(response => {
        state.userRole = response.data.data.role.map(value => {
          return value.title
        })
        if (state.userRole != "writer") {
          router.push("/books")
        }
      })
}

const order = async () => {
  await axios.get('//localhost:8080/api/api/orders')
      .then(response => {
        state.orders = response.data.data
      })
      .catch(error => {
        console.log(error)
      })
}

const orderConf = async () => {

}

onMounted( () => {
  user()
  order()
})
</script>