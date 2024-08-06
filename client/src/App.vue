<template>
  <div id="app">
    <title>Revind</title>
    <div>
      <b-navbar id="nav" toggleable="lg" type="dark">
        <b-navbar-brand class="font-weight-bold" href="/">Revind</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item id="product" class="text-uppercase" @click="$router.push('/items')">Products</b-nav-item>
            <b-nav-item id="location" class="text-uppercase" @click="$router.push('/locations')">Locations</b-nav-item>
            <b-nav-item id="suggestion" class="text-uppercase" href="/suggestions" target="_blank">Suggestions</b-nav-item>
            <b-nav-item v-if="this.currentUser.userType === 'Admin'" id="adminView" class="text-uppercase" @click="$router.push('/adminView')">Admin View</b-nav-item>
          </b-navbar-nav>
          <!-- Right aligned items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-if="this.currentUser._id !== ''">
              <template #button-content>
                <em id="user">User</em>
              </template>
              <b-dropdown-item href="/profile">Profile ({{currentUser.username}})</b-dropdown-item>
              <b-dropdown-item @click="signOut()">Sign Out</b-dropdown-item><!-- Link to Sign Out HERE-->
            </b-nav-item-dropdown>
            <b-button id="logInButton" variant="success" right v-else href="/login">Log In</b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>
<script>

import { Api } from './Api'

export default {
  name: 'Revind',
  mounted() {
    this.getUserData()
  },
  data() {
    return {
      currentUser: {
        _id: '',
        username: '',
        userType: ''
      }
    }
  },
  methods: {
    getUserData() { // check if cookie exists(buzzsaw) = https://stackoverflow.com/questions/33203120/check-if-cookie-exists-not-working
      try {
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            this.currentUser._id = window.document.cookie.split('=')[1]
            Api.get(`/users/${this.currentUser._id}`).then(resp => {
              this.currentUser.username = resp.data.username
              this.currentUser.userType = resp.data.userType
            })
          } else {
            this.currentUser._id = ''
            console.log('No user cookie exists')
          }
        } else {
          this.currentUser._id = ''
          console.log('User cookie has no value')
        }
      } catch (error) {
        console.log(error)
      }
    },
    signOut() {
      try {
        window.document.cookie = 'userId=;Thu, 01 Jan 1970 00:00:00 GMT; path=/'
        window.location = '/'
      } catch (error) {
        console.log('failed to log out')
      }
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
  background: #eee;
}
#nav{
  background-image: linear-gradient(to right, #73d86e,hsl(117, 65%, 30%))!important;
}
#location{
  font-weight: 600;
}
#product{
  font-weight: 600;
}
#suggestion{
  font-weight: 600;
}
#user{
  font-weight: 600;
}
#adminView{
  font-weight: 600;
}
.navbar-dark .navbar-nav .nav-link{
  color:black!important
}
</style>
