import {createRouter, createWebHistory} from "vue-router";

import adminPage from '../admin/index.vue'
import homePage from '../pages/index.vue'
import notFound from '../notFound.vue'
import booksPage from '../books/books.vue'
import showBook from '../books/showBook.vue'
import test from '../books/date-pick.vue'
import login from '../auth/login.vue'
import users from '../admin/createUser.vue'
import showUser from '../admin/showUser.vue'

const routes = [
    {
        path: '/admin',
        name:'admin',
        component: adminPage,
        meta: {
            requiresAuth: true
        }

    },
    {
        path: '/',
        name: 'Home',
        component: homePage,
        meta: {
            requiresAuth: true
        }
    },

    {
      path: '/books',
      component: booksPage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: notFound,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/books/:bookId',
        component: showBook,
        name: 'showBook',
        props: true,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/users/:userId',
        component: showUser,
        name: 'showUser',
        props: true,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: login,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/users',
        name:'users',
        component: users,
        meta: {
            requiresAuth: true
        }
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to,from) => {
    if(to.meta.requiresAuth && !localStorage.getItem('token')){
        return {name: 'Login'}
    }
    if (to.meta.requiresAuth === false && localStorage.getItem('token')) {
        return {name: 'admin'}
    }
})

export default router