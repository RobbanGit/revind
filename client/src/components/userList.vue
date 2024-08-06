<template>
  <b-container id="userListContainer">
    <b-row><b-col><h1>User List:</h1></b-col></b-row>
    <b-row>
      <b-col>
        <b-button variant="danger" id="removeAllUsersButton" @click="deleteAllUsers">Delete All Users</b-button>
      </b-col>
    </b-row>
    <b-row class="col-11" v-for="user in users" :key="user._id">
      <b-col>
        <user-component v-bind:user="user" v-on:del-user="deleteUser" v-on:show-user-modal="showModalWindow" v-on:update-user-info="updateUserInfo" v-on:change-user-type="changeUserType"/>
      </b-col>
    </b-row>
  </b-container>
</template>
// Separate component for users, so that we can switch between the different entities via a dropdown menu. Depending on what the user picked, we display a different component
<script>
import { Api } from '../Api'
import UserComponent from './userComponent'

export default {
  components: { 'user-component': UserComponent },
  mounted() {
    this.loadUsers()
  },
  data() {
    return {
      users: []
    }
  },
  methods: {
    loadUsers() {
      Api.get('/users/').then(resp => {
        this.users = resp.data.users
      }).catch(() => {
        this.errorMessage = 'Something went wrong when importing users'
      })
    },
    deleteUser(userId) {
      console.log(userId)
      Api.delete(`/users/${userId}`).then(resp => {
        const userIndex = this.users.findIndex(user => user._id === userId)
        this.users.splice(userIndex, 1)
        this.errorMessage = 'Successfully deleted user!'
        setTimeout(() => {
          this.errorMessage = ''
        }, 5000)
      }).catch(() => {
        this.errorMessage = `Could not delete user with id: ${this.user._id}`
      })
    },
    deleteAllUsers() {
      console.log('Deleting all users') // Clear array content reactive src: https://stackoverflow.com/questions/57834381/vue-js-clearing-an-array-content-and-reactivity-issues
      Api.delete('/users/').then(() => {
        this.users.splice(0)
      }).catch(() => {
        this.errorMessage = 'could not delete all users!'
      })
    },
    showModalWindow(userId) {
      try {
        const userModalVar = document.getElementById(`userModal${userId}`)
        if (userModalVar.style.display === 'block') {
          userModalVar.style.display = 'none'
        } else {
          userModalVar.style.display = 'block'
        }
      } catch (error) {
        this.errorMessage = 'Failed to access user element'
      }
    },
    updateUserInfo(userId) {
      try {
        console.log('Just entered updateUserInfo')
        const userEmailValue = document.getElementById(`emailField${userId}`).value
        const userUsernameValue = document.getElementById(`usernameField${userId}`).value
        const userPasswordValue = document.getElementById(`passwordField${userId}`).value

        Api.put(`/users/${userId}`, {
          email: userEmailValue,
          username: userUsernameValue,
          password: userPasswordValue
        }).then(response => {
          console.log(`user with id: ${userId} has been updated!`)
        })
      } catch (err) {
        console.log(err)
        this.errorMessage = `could not update user with id: ${userId}`
      }
    },
    changeUserType(user) {
      try {
        let futureUserType = null
        if (user.userType === 'User') {
          futureUserType = 'Admin'
        } else {
          futureUserType = 'User'
        }
        Api.patch(`/users/${user._id}`, {
          userType: futureUserType
        }).then(() => {
          console.log('User type has been updated')
        })
      } catch (err) {
        console.log(err)
        this.errorMessage = `could not change usertype of user: ${user.username}`
      }
    }
  }
}

</script>
