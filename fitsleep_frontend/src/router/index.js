import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/signIn'
import List from '@/components/list'
import Setting from '@/components/setting'
import Users from '@/components/users'
import Wet from '@/components/wet'
import Temp from '@/components/temp'
import Serv from '@/components/serv'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/wet',
      name: 'Wet',
      component: Wet
    },
    {
      path: '/temp',
      name: 'Temp',
      component: Temp
    },
    {
      path: '/serv',
      name: 'Serv',
      component: Serv
    }
  ]
})
