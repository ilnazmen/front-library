<template>
  <div class="container">
    <h1>Книги</h1>
    <form @submit.prevent="addBook">
      <div class="form-group">
        <input type="text" class="form-control mt-3" v-model="name" placeholder="Название книги">
        <input type="text" class="form-control mt-3" v-model="author" placeholder="Имя Автора">
        <input type="text" class="form-control mt-3" v-model="publisher" placeholder="Издатель">
        <input class="form-control mt-3" v-on:change="changeFile" id="photo" name="photo" type="file">
        <date-pick v-model="release_date" class="mt-3"></date-pick>
        <textarea placeholder="Описание книги" v-model="description" class="form-control mt-3" rows="3"></textarea>
        <select class="form-select mt-3" multiple aria-label="multiple select example" v-model="genre">
          <option v-for="genre in genres" :value="genre.id">{{ genre.title }}</option>
        </select>
        <select class="form-select mt-3" aria-label="Default select example" v-model="status">
          <option v-for="status in statuses" :value="status.id">{{ status.title }}</option>
        </select>
        <button type="submit" @click.prevent="addBook" class="btn btn-primary mt-3">Добавить</button>
      </div>
    </form>
    <div class="row">
      <div class="col-4" v-for="book in books">
        <div class="card mt-3">
          <router-link class="card-body" :to="{name: 'showBook', params: {bookId: book.id}}">
            <h5 class="card-title">{{ book.name }}</h5>
            <p class="card-text">{{ book.author }}</p>
            <p class="card-text">{{ book.description }}</p>
            <p class="card-text">{{ book.publisher }}</p>
            <img :src="book.image" alt="" style="max-width: 100%">

            <p class="card-text">{{ book.release_date }}</p>
            <ul v-for="value in book.genre">
              <li>{{value.title}}</li>
            </ul>
            <div>{{book.status.title}}</div>
<!--            <div v-for="value in book.status">-->
<!--           <p>-->
<!--             {{value}}-->
<!--           </p>-->
<!--            </div>-->
          </router-link>
          <button type="button" class="btn btn-danger" @click="deleteBook(book.id)">Удалить</button>
        </div>
      </div>
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
import showBook from "@/components/books/showBook.vue";
import DatePick from "@/components/books/date-pick.vue";
import dayjs from "dayjs";


export default {
  components: {DatePick},
  computed: {
    showBook() {
      return showBook
    },
  },
  data() {
    return {
      books: [],
      genres: [],
      statuses: [],
      book_url: null,
      genre: [],
      status: null,
      name: null,
      author: null,
      publisher: null,
      image: null,
      description: null,
      release_date: null,

      errored: false,
      loading: true,
      data: null,
    }
  },
  methods: {
    changeFile(photo) {
      this.image = photo.target.files[0]
      // console.log(photo)
    },

    showGenre() {
      axios.get('//localhost:8080/api/api/genres')
          .then(response => {
            this.genres = response.data
          })
    }, showStatus() {
      axios.get('//localhost:8080/api/api/statuses')
          .then(response => {
            this.statuses = response.data.filter((status) => {
              return status.id === 1 || status.id === 4
            })
          })
    },
    showAllBooks() {
      axios.get('//localhost:8080/api/api/books')
          .then(response => {
            this.books = response.data.data
          })
          .catch(error => {
            console.log(error)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
    },
    deleteBook(id) {
      axios.post('//localhost:8080/api/api/books/' + id, {
        _method: 'DELETE'
      })
          .then(response => {
            this.books = []
            this.showAllBooks()
          })
          .catch(error => {
            console.log(error)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
    },
    getToken(){
      axios.get('/sanctum/csrf-cookie')
          .then(response => {
          return response
      })

    },
    addBook() {
      // this.getToken();
      const data = new FormData()
      data.append('image', this.image)
      data.append('name', this.name)
      data.append('author', this.author)
      data.append('publisher', this.publisher)
      data.append('description', this.description)
      data.append('release_date', dayjs(this.release_date).format())
      data.append('status_id', this.status)
      this.genre.forEach((genre) => {
        data.append("genre_id[]", genre)
      })
      data.append('ImageUrl', '///')

      axios.post('//localhost:8080/api/api/books/', data)
          .then(response => {
            this.name = ''
            this.books = []
            this.showAllBooks()
          })
          .catch(error => {
            console.log(error)
            errored.value = true
          })
    }
  },
  mounted() {
    this.showAllBooks()
    this.showGenre()
    this.showStatus()
  }
}

</script>

<style lang="scss" scoped>

</style>