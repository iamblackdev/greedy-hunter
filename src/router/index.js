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
    beforeEnter: (to, from, next) => {
      if (to.params.grid || localStorage.getItem('storedGrid')) {
        next()
      } else {
        next({name: 'gameStart'})
      }
      
    }
  },
  // CATCHING ALL 404 PAGE 
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
