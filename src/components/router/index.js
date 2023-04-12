import {createRouter, createWebHistory} from "vue-router";
import adminPage from '../admin/index.vue'
import homePage from '../pages/index.vue'
import notFound from '../notFound.vue'
import booksPage from '../books/books.vue'
import adminBooks from '../admin/createBooks.vue'
import showBook from '../books/showBook.vue'
import test from '../books/date-pick.vue'
import login from '../auth/login.vue'
import users from '../admin/createUser.vue'
import showUser from '../admin/showUser.vue'
import forgotPassword from '../auth/forgotPassword.vue'
import resetPassword from '../auth/resetPassword.vue'
import modalPage from '../books/modal.vue'
import writerPage from '../writer/index.vue'
import userOrders from '../books/userOrders.vue'

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
      path: '/admin/books',
      component: adminBooks,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/books',
        name: 'Books',
        component: booksPage,
        meta: {
            requiresAuth: true
        }
    },{
        name: 'Modal',
        component: modalPage,
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
        path: '/admin/books/:bookId',
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
        path: '/forgot-password',
        name: 'forgotPassword',
        component: forgotPassword,
        meta: {
            requiresAuth: false
        }
    },{
        path: '/reset-password/:token',
        name: 'resetPassword',
        component: resetPassword,
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
    {
        path: '/writer',
        name: 'writer',
        component: writerPage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/user-orders',
        name: 'userOrders',
        component: userOrders,
        meta: {
            requiresAuth: true
        }
    }
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
        return {name: 'Home'}
    }
})

export default router