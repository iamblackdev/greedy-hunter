import { createRouter, createWebHistory } from 'vue-router'
import gameStart from '../views/GameStart.vue'
import gamePlay from '../views/GamePlay.vue'

const routes = [
  {
    path: '/',
    name: 'gameStart',
    component: gameStart,
    props: true
  },
  {
    path: '/gameplay',
    name: 'gamePlay',
    component: gamePlay,

    // REDIRECTING USER WHO ROUTER INTO THE PAGE WITHPOUT SELECTING GRID SIZE
    beforeEnter: (to, from, next) => {

      // checking if grid size is selected
      if (to.params.grid || localStorage.getItem('storedGrid')) {
        next()
      } else {
        next({name: 'gameStart'})
      }
      
    }
  },
  // CATCHING ALL 404 PAGE AND REDIRECTING THEM BACK TO THE HOME PAGE
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
