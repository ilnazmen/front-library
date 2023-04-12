<template>

  <div class="container">
    <div class="form-group mt-3" v-if="!!state.image">
      <input type="text" v-model="state.name" name="name" class="form-control">
      <!--             :class="{ 'is-invalid': validator.name.$errors?.length }">-->
      <input type="text" class="form-control mt-3" v-model="state.author" placeholder="Имя Автора">
      <input type="text" class="form-control mt-3" v-model="state.publisher" placeholder="Издатель">
      <input class="form-control mt-3" v-on:change="changeFile" id="photo" name="photo" type="file" placeholder="Добавить файл">
      <span v-if="!state.image">Нету фото</span>
      <div class="div mt-3" v-if="!!state.image">
        <img :src="state.image" alt="" style="max-width: 30%">
      </div>
      <date-pick v-model="state.release_date" class="mt-3"></date-pick>
      <textarea placeholder="Описание книги" v-model="state.description" class="form-control mt-3" rows="3"></textarea>
      <select class="form-select mt-3" multiple aria-label="multiple select example" v-model="state.genre">
        <option v-for="genre in state.genres" :value="genre.id">{{ genre.title }}</option>
      </select>
      <select class="form-select mt-3" aria-label="Default select example" v-model="state.status">
        <option v-for="status in state.statuses" :value="status.id">{{ status.title }}</option>
      </select>
      <button type="submit" @click.prevent="savename" class="btn btn-primary mt-3">Добавить</button>
      <div class="invalid-feedback">
        <!--        {{ validator.name.$errors?.[0]?.$message }}-->
      </div>

      <!--      <div class="invalid-feedback">-->
      <!--        Макс количество символов:-->
      <!--      </div>-->
    </div>
    <!--    <div class="alert alert-danger" role="alert" v-if="errored">-->
    <!--      pizda-->
    <!--    </div>-->
    <div class="spinner-border" role="status" v-if="loading">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import data from "bootstrap/js/src/dom/data";
import {useVuelidate} from '@vuelidate/core'
import {required, maxLength} from '@vuelidate/validators'
import {computed, onMounted, reactive, ref} from "vue";
import DatePick from "@/components/books/date-pick.vue";
import dayjs from "dayjs";
import books from "@/components/books/books.vue";

const props = defineProps(['bookId'])

// const bookForm = reactive({
//   name: '',
// })

const errored = ref(false)
const loading = ref(true)

const state = reactive({
  name: '',
  books: [],
  genres: [],
  statuses: [],

  genre: [],
  status: '',
  author: '',
  publisher: '',
  image: '',
  description: '',
  release_date: '',
  formdata: null,
})

// const rules = {
//   name: {
//     required,
//     maxLength: maxLength(20)
//   }
// }
// const validator = useVuelidate(rules, state)
// const form = async () => {
//   const result = await validator.value.$validate();
//
//   if (result) {
//     console.log('oke')
//   } else {
//     alert("hui")
//   }
// }

function savename() {
  const data = new FormData()
  data.append('name', state.name)
  data.append('author', state.author)
  data.append('publisher', state.publisher)
  data.append('description', state.description)
  data.append('image', state.image)
  data.append('release_date', dayjs(state.release_date).format())
  data.append('status_id', state.status)
  state.genre.forEach((genre) => {
    data.append("genre_id[]", genre)
  })
  data.append('ImageUrl', '///')
  data.forEach((el) => console.log(el))
  data.append('_method', 'PUT');

  axios.post('//localhost:8080/api/api/books/' + props.bookId, data)
      .then(response => {

      })
      .catch(error => {
        console.log(error)
        errored.value = true
      })
      .finally(() => {
        loading.value = false
      })
}

function changeFile(photo) {
  state.image = photo.target.files[0]
  // console.log(photo)
}

function showGenre() {
  axios.get('//localhost:8080/api/api/genres')
      .then(response => {
        state.genres = response.data
        console.log(state.genres)
      })
}

function showStatus() {
  axios.get('//localhost:8080/api/api/statuses')
      .then(response => {
        state.statuses = response.data
      })
}


onMounted(() => {
  axios.get('//localhost:8080/api/api/books/' + props.bookId)
      .then(response => {
        state.name = response.data.data.name
        state.author = response.data.data.author
        state.publisher = response.data.data.publisher
        state.description = response.data.data.description
        state.release_date = response.data.data.release_date
        state.genre = response.data.data.genre.map(value => {
          return value.id
        })
        state.status = response.data.data.status.id
        state.image = response.data.data.image
        console.log(state.publisher)
      })
      .catch(error => {
        console.log(error)
        errored.value = true
      })
      .finally(() => {
        loading.value = false
      })
  showGenre()
  showStatus()
})
</script>

<style lang="scss" scoped>

</style>