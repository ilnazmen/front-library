<template>
  <div class="container">
    <h1>Книги</h1>
    <form @submit.prevent="addBook">
      <div class="form-group">
        <input type="text" class="form-control mt-3"  placeholder="Название книги">
        <input type="text" class="form-control mt-3"  placeholder="Имя Автора">
        <input type="text" class="form-control mt-3"  placeholder="Издатель">
        <input class="form-control mt-3" type="file">
        <date-pick class="mt-3"></date-pick>
        <textarea placeholder="Описание книги" class="form-control mt-3" rows="3"></textarea>
        <select class="form-select mt-3" multiple aria-label="multiple select example" v-model="genre">
          <option v-for="genre in genres" :value="genre.id">{{genre.title}}</option>
        </select>
        <select class="form-select mt-3" aria-label="Default select example" v-model="status">
          <option  v-for="status in statuses" :value="status.id">{{status.title}}</option>
        </select>
        <button type="submit" class="btn btn-primary mt-3">Добавить</button>
      </div>
    </form>
    <div class="row">
      <div class="col-4" v-for="book in books">
      <div class="card mt-3" >
          <router-link class="card-body" :to="{name: 'showBook', params: {bookId: book.id}}">
            <h5 class="card-title">{{book.name}}</h5>
            <p class="card-text">{{book.author}}</p>
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

export default {
  components: {DatePick},
  computed: {
    showBook() {
      return showBook
    },
  },
  data(){
    return {
      books: [],
      genres: [],
      statuses: [],

      genre: [],
      status: null,

      errored: false,
      loading: true,
      data: null,
    }
  },
  methods: {
    showGenre(){
      axios.get('//localhost:8080/api/api/genres')
          .then(response => {
            this.genres = response.data
          })
    },showStatus(){
      axios.get('//localhost:8080/api/api/statuses')
          .then(response => {
            this.statuses = response.data.filter((status)=>{
              return status.id === 1 || status.id === 4
            })
          })
    },
    showAllBooks(){
      axios.get('//localhost:8080/api/api/books')
          .then(response => {
            this.books = response.data.data
          })
          .catch(error => {
            console.log(error)
            this.errored = true
          })
          .finally( () => {
            this.loading = false
          })
    },
    deleteBook(id){
      axios.post('//localhost:8080/api/api/books/' + id,{
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
          .finally( () => {
            this.loading = false
          })
    },
    addBook(){

    }
  },
  mounted(){
    this.showAllBooks()
    this.showGenre()
    this.showStatus()
  }
}
</script>

<style lang="scss" scoped>

</style>