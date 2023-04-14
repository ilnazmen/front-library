<template>
  <div class="container">
    <router-link to="/admin/books">Добавить книгу</router-link>
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
        <button type="button"
                v-if="order.book_id.status_id === 2"
                class="btn btn-primary"
                @click="showModal(order.book_id.id,order.id )" >Подтвердить</button>
        <button type="button"
                v-if="order.book_id.status_id === 1"
                class="btn btn-primary"
                @click="cancel(order.id, order.book_id.id, 4)">Опубликовать</button>
        <button type="button"
                v-if="order.book_id.status_id === 3"
                class="btn btn-primary"
                @click="cancel(order.id, order.book_id.id, 1)">Возврат</button>
        <button type="button"
                style="float: right"
                class="btn btn-danger"
                @click="cancel(order.id, order.book_id.id,4)">Отменить</button>
      </div>
    </div>
      </div>
      <modal :visible="modalVisible"
             :book_id="modalData.book_id"
             :order_id="modalData.order_id"
             @close="modalVisible = false"
             @update="order()">
      </modal>
    </div>
    <button  @click.prevent="logout" class="btn btn-primary mt-3">Выйти</button>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router"
import {onMounted, reactive, ref} from "vue";
import Modal from "@/components/writer/modal.vue";

const state = reactive({
  userId: '',
  userRole: '',
  orders: [],
})

const modalData = ref({

})
const modalVisible = ref(false)

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
        if (state.userRole != "writer" && state.userRole != "admin") {
          router.push("/books")
        }
        order()
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

function showModal(book_id,order_id) {
  modalVisible.value = true
  modalData.value = {
    book_id:book_id,
    order_id:order_id
  }
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
        console.log(error)
      })
  order()
      }

onMounted( () => {
  user()
})
</script>