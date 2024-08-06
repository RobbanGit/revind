<template>
  <b-container fluid="md" class="RegisterContainer">
    <b-row>
      <label>Email:</label>
      <input type="text"
             id="email"
             class="form-control"
             v-model="userData.email">
    </b-row>
    <b-row>
      <label>Username:</label>
      <input type="text"
             id="username"
             class="form-control"
             v-model="userData.username">
    </b-row>
    <b-row>
      <label>Password:</label>
      <input type="password"
             id="password"
             class="form-control"
             v-model="userData.password">
    </b-row>
    <b-button @click="createUser()">Register</b-button>

    <h1> {{registerMessage}}</h1>
  </b-container>
</template>

<script>

import { Api } from '../Api'

export default {
  mounted() {
  },
  data() {
    return {
      userData: {
        email: '',
        username: '',
        userType: '',
        password: ''
      },
      registerMessage: null
    }
  },
  methods: {
    createUser() {
      try {
        Api.post('/users',
          {
            email: this.userData.email,
            username: this.userData.username,
            userType: 'User',
            password: this.userData.password
          }
        ).then(resp => {
          if (resp.status === 200 || resp.status === 201) {
            this.registerMessage = 'User has been registered!'
            setTimeout(() => {
              this.redirectToStart()
            }, 3000)
          } else {
            this.registerMessage = 'Registration failed!'
          }
        })
      } catch (err) {
        this.registerMessage = 'Something went wrong when registering!'
      }
    },
    redirectToStart() {
      window.location = '/login'
    }
  }
}

</script>
