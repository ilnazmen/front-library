import {createRouter, createWebHistory} from "vue-router";

import adminPage from '../admin/index.vue'
import homePage from '../pages/index.vue'
import notFound from '../notFound.vue'
import booksPage from '../books/books.vue'
import showBook from '../books/showBook.vue'
import test from '../books/date-pick.vue'
import photoInput from "@/components/books/photo-input.vue";

const routes = [
    {
        path: '/admin',
        component: adminPage

    },
    {
        path: '/',
        component: homePage
    },

    {
      path: '/books',
      component: booksPage,
    },
    {
        path: '/:pathMatch(.*)*',
        component: notFound
    },
    {
        path: '/books/:bookId',
        component: showBook,
        name: 'showBook',
        props: true,
    },
    {
        path: '/test',
        component: photoInput,
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router