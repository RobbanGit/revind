<template>
  <b-container fluid="md" class="LoginContainer">
    <b-row>
      <label>Email:</label>
      <input type="text"
             id="email"
             class="form-control"
             v-model="userData.email">
    </b-row>
    <b-row>
      <label>Password:</label>
      <input type="password"
             id="password"
             class="form-control"
             v-model="userData.password">
    </b-row>

    <b-button @click="loginUser()">Log In</b-button>
    <p>{{loginMessage}}</p>
  </b-container>
</template>

<script>

import { Api } from '../Api'

export default {
  data() {
    return {
      userData: {
        email: '',
        password: ''
      },
      loginMessage: null
    }
  },
  methods: {
    loginUser() {
      try {
        this.loginMessage = null
        Api.post('/login', { // redirect before login, maybe async await or something?
          email: this.userData.email,
          password: this.userData.password
        }).then(resp => {
          console.log(`resp.data value: ${JSON.stringify(resp.data)}`)
          if (resp.data === -1) {
            this.loginMessage = 'Incorrect user credentials!'
            this.userData.email = ''
            this.userData.password = ''
            setTimeout(() => {
              this.loginMessage = ''
            }, 5000)
          } else {
            if (resp.status === 200 || resp.status === 204) {
              window.document.cookie = 'userId=' + resp.data
              console.log('Cookie has been set with the following value:')
              console.log(window.document.cookie)
              window.location = '/'
            } else {
              this.loginMessage = 'Check Login Credentials!'
              window.location = '/login'
            }
          }
        })
      } catch (err) {
        this.loginMessage = 'Something went wrong upon logging in!'
        console.log(`error(loginUser()): ${err}`)
      }
    }
  }

}

</script>
