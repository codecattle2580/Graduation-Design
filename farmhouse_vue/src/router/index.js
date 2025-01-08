import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Register from '@/components/Register.vue'
import Welcome from '@/components/Welcome.vue'

import User from '@/views/user/User'
import Modify from '@/views/user/modify.vue'
import Agritainment from '@/views/select/Agritainment.vue'
import Food from '@/views/select/Food.vue'
import Room from '@/views/select/Room.vue'
import Order from '@/views/select/Order.vue'
import Message from '@/views/select/Message'

import Agritainment0 from '@/views/administrators/Agritainment0'
import Food0 from '@/views/administrators/Food0.vue'
import Room0 from '@/views/administrators/Room0.vue'
import Order0 from '@/views/administrators/Order0.vue'
import Message0 from '@/views/administrators/Message0'
import Users from '@/views/administrators/Users'

import Agritainment1 from '@/views/merchant/Agritainment1'
import Food1 from '@/views/merchant/Food1.vue'
import Room1 from '@/views/merchant/Room1.vue'
import Order1 from '@/views/merchant/Order1.vue'
import Message1 from '@/views/merchant/Message1'

import UserPage from '@/views/UserPage/UserPage'
import AgritainmentPage from '@/views/UserPage/AgritainmentPage'
import FoodPage from '@/views/UserPage/FoodPage'
import RoomPage from '@/views/UserPage/RoomPage'
import FarmstayDetail from '@/views/UserPage/FarmstayDetail'
import FoodDetail from '@/views/UserPage/FoodDetail'
import RoomDetail from '@/views/UserPage/RoomDetail'
import RoomBook from '@/views/UserPage/RoomBook'
import Information from '@/views/UserPage/Information'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/userpage' },
  {path: '/userpage',component: UserPage},
  {path: '/register', component: Register},
  {path: '/login',component: Login},
  {path: '/agritainmentPage',component: AgritainmentPage},
  {path: '/foodPage',component: FoodPage },
  {path: '/roomPage',component: RoomPage},
  {path: '/farmstayDetail/:nid',name:'farmstayDetail',component: FarmstayDetail},
  {path: '/foodDetail/:mid',name:'foodDetail',component: FoodDetail},
  {path: '/roomDetail/:zid',name:'roomDetail',component: RoomDetail},
  {path: '/roomBook/:zid',name:'roomBook',component: RoomBook},
  {path: '/information',name:'information',component: Information},
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/user', component: User },
      { path: '/modify', component: Modify },
      { path: '/agritainment', component: Agritainment },
      { path: '/food', component: Food },
      { path: '/room', component: Room },
      { path: '/order', component: Order },
      { path: '/message', component: Message },

      { path: '/agritainment0', component: Agritainment0 },
      { path: '/food0', component: Food0 },
      { path: '/room0', component: Room0 },
      { path: '/order0', component: Order0 },
      { path: '/message0', component: Message0 },
      { path: '/users', component: Users },

      { path: '/agritainment1', component: Agritainment1 },
      { path: '/food1', component: Food1 },
      { path: '/room1', component: Room1 },
      { path: '/order1', component: Order1 },
      { path: '/message1', component: Message1 },


    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, resolve, reject) {
  if (resolve || reject) return originalPush.call(this, location, resolve, reject)
  return originalPush.call(this, location).catch((e) => { })
}

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register'||to.path === '/userpage') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
