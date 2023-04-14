<template>
  <div class="container">
    <router-link to="/books">Книги</router-link>
    <br>
    <router-link to="/user-orders">Заказы</router-link>
    <br>
    <button  @click.prevent="logout" class="btn btn-primary mt-3">Выйти</button>
    <h1>Книги</h1>
    <div class="search row">
      <h2 class="text-center">Воспользуемся поиском</h2>
      <input type="text" class="text-center mx-auto w-75" v-model="this.input">
    </div>
    <div class="row">
      <div class="col-4" v-for="book in filteredBooks" :key="book.id">
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">{{ book.name }}</h5>
            <p class="card-text">{{ book.author }}</p>
            <p class="card-text">{{ book.description }}</p>
            <p class="card-text">{{ book.publisher }}</p>
            <img :src="book.image" alt="" style="max-width: 100%">
            <p class="card-text">{{ book.release_date }}</p>
            <ul v-for="value in book.genre">
              <li>{{ value.title }}</li>
            </ul>
          </div>
          <button type="button" v-if="book.status.id === 4" class="btn btn-danger" @click="showModal(book.id)">Заказать</button>
          <button type="button"
                  v-if="book.status.id === 2 || book.status.id === 3 || book.status.id === 1"
                  class="btn btn-dark">Недоступно к заказу</button>
        </div>
      </div>
      <modal v-model:show="modalVisible">
        <p>Вы уверены, что хотите заказать эту книгу?</p>
        <button type="button" class="btn btn-primary" @click="orderBook">Заказать</button>
      </modal>
    </div>
    <div class="alert alert-danger" role="alert" v-if="errored">
      pizda
    </div>
    <div class="spinner-border" role="status" v-if="loading">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>

import DatePick from "@/components/books/date-pick.vue";
import dayjs from "dayjs";
import Modal from "@/components/books/modal.vue";
import {integer} from "@vuelidate/validators";
import {useRouter} from "vue-router";
import router from "@/components/router";


export default {
  components: {Modal, DatePick},
  computed: {
    filteredBooks() {
      return this.books.filter((book) => {
            const genres = book.genre
            if (
                book.author.toLowerCase().includes(this.input.toLowerCase()) ||
                book.publisher.toLowerCase().includes(this.input.toLowerCase()) ||
                genres.filter((genre) => {
                  return genre.title.toLowerCase().includes(this.input.toLowerCase())
                }).length
            ) {
              return true
            }
            return false
          }
      )
    },
  },
  data() {
    return {
      books: [],
      genres: [],
      statuses: [],
      book_url: null,
      errored: false,
      loading: true,
      data: null,
      userToken: '',
      userInfo: '',
      input: '',
      modalVisible: false,
      book_id: integer,
      order_date: '',
    }
  },
  methods: {
    router () {useRouter()},
   logout () {
      localStorage.removeItem('token')
     this.$router.push('/')
    },
    getToken() {
      return localStorage.getItem('token')
    },

    makeToken() {
      return `Bearer ${this.getToken()}`;
    },
    getUser() {
      axios.get("//localhost:8080/api/api/user", {
        headers: {Authorization: this.makeToken()},
      })
          .then(response => {
            this.userInfo = response.data
          })
          .catch(error => {
            this.logout()
          })
    },
    showAllBooks() {
      axios.get('//localhost:8080/api/api/books')
          .then(response => {
            this.books = response.data.data
          })
          .catch(error => {
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
    },

    showModal(id) {
      console.log(id)
      this.modalVisible = true;
      this.book_id = id;
      this.order_date = new Date();
    },
    orderBook() {
      axios.post('//localhost:8080/api/api/orders', {
        book_id: this.book_id,
        user_id: this.userInfo.id,
        order_date: this.order_date
      })
          .then(response => {
            console.log(this.book_id)
            this.statusChange()
          })
          .catch(error => {
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
    },
    statusChange() {
      let id = this.book_id
      axios.post('//localhost:8080/api/api/statuses', {
        book_id: id,
        status_id: 2
      })
          .then(response => {
            this.books = []
            this.showAllBooks()
            this.modalVisible = false
          })
          .catch(error => {
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
    },

  },
  mounted() {
    this.showAllBooks()
    this.getToken()
    this.makeToken()
    this.getUser()
  }
}

</script>

<style lang="scss" scoped>

</style>