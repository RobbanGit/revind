import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Suggestions from './views/Suggestions.vue'
import Start from './views/Start'
import Register from './views/Register'
import Login from './views/Login'
import EmptyProfile from './views/EmptyProfile'
import Profile from './views/Profile'
import EmptyProfileOptions from './views/EmptyProfileOptions'
import ProfileOptions from './views/Profile_Options'
import AllItems from './views/Products.vue'
import ShowItem from './views/ShowItem.vue'
import AddItems from './views/AddItems.vue'
import PutItem from './views/PutItem.vue'
import PatchItem from './views/PatchItem.vue'
import Location from './views/Location.vue'
import AddLocation from './views/AddLocation.vue'
import PatchLocation from './views/PatchLocation.vue'
import PutLocation from './views/PutLocation.vue'
import ShowLocation from './views/ShowLocation.vue'
import AdminView from './views/adminView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/suggestions',
      name: 'suggestions',
      component: Suggestions
    },
    {
      path: '/start',
      name: 'start',
      component: Start
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profile',
      name: 'emptyProfile',
      component: EmptyProfile
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: Profile
    },
    {
      path: '/profile-options',
      name: 'profile-options',
      component: EmptyProfileOptions
    },
    {
      path: '/profile-options/:userId',
      name: 'profile-options-id',
      component: ProfileOptions
    },
    {
      path: '/items',
      name: 'Products',
      component: AllItems
    },
    {
      path: '/items/:id',
      component: ShowItem
    },
    {
      path: '/additems',
      component: AddItems
    },
    {
      path: '/items/editAll/:id',
      component: PutItem
    },
    {
      path: '/items/edit/:id',
      component: PatchItem
    },
    {
      path: '/locations',
      component: Location
    },
    {
      path: '/addlocations',
      component: AddLocation
    },
    {
      path: '/locations/edit/:id',
      component: PatchLocation
    },
    {
      path: '/locations/editAll/:id',
      component: PutLocation
    },
    {
      path: '/locations/:id',
      component: ShowLocation
    },
    {
      path: '/adminView',
      component: AdminView
    }
  ]
})
