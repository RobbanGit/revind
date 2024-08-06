<template>
  <b-container id="profileOptionsContainer">
    <p>Account info:</p>
    <b-row>
      <b-col>
        <label>Email: </label>
      </b-col>
      <b-col>
        <b-form-input id="emailForm" :value="this.relatedUser.email"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Username: </label>
      </b-col>
      <b-col>
        <b-form-input id="usernameForm" :value="this.relatedUser.username"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Password: </label>
      </b-col>
      <b-col>
        <b-form-input id="passwordForm" type=password :value="this.relatedUser.password"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>User Type: </label>
      </b-col>
      <b-col>
        {{this.relatedUser.userType}}
      </b-col>
      <b-col>
        <b-button id="makeUserAdminButton" variant="danger" @click="makeAdmin()">Make Admin</b-button>
        <b-button id="makeAdminUserButton" variant="danger" @click="makeUser()">Make User</b-button>
      </b-col>
    </b-row>
    <b-row id="buttonRow">
      <b-col>
        <b-button id="updateUserInfoButton" @click="updateUserInfo()">Update User Information</b-button>
      </b-col>
      <b-col>
        <b-button id="togglePasswordButton" @click="toggleShowPassword()">Toggle Password</b-button>
      </b-col>
    </b-row>
    <h1> {{updateUserMessage}}</h1>
  </b-container>
</template>

<script>

import { Api } from '../Api'

export default {
  mounted() {
    this.getUserData()
  },
  data() {
    return {
      currentUser: {
        _id: '',
        email: '',
        username: '',
        password: '',
        userType: ''
      },
      relatedUser: {
        _id: this.$route.params.userId,
        email: '',
        username: '',
        password: '',
        userType: ''
      },
      updateUserMessage: null
    }
  },
  methods: {
    getUserData() {
      try {
        // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            Api.get(`/users/${userid}`).then(resp => {
              this.currentUser._id = resp.data._id
              this.currentUser.userType = resp.data.userType
            })
          }
        }
      } catch (error) {
        this.updateUserMessage = 'Failed to load user information'
      }

      if (this.relatedUser._id !== '') {
        const relatedUserInfo = Api.get(`/users/${this.relatedUser._id}`)
        relatedUserInfo.then(resp => {
          this.relatedUser.email = resp.data.email
          this.relatedUser.username = resp.data.username
          this.relatedUser.password = resp.data.password
          this.relatedUser.userType = resp.data.userType
          console.log(`THIS.CURRENTUSER.Id:${this.currentUser._id}`)
          console.log(`THIS.RELATEDUSER.Id:${this.relatedUser._id}`)
          this.checkAdminButtonRights()
        }).catch(() => {
          this.updateUserMessage = 'Failed to load information from this user'
        })
      }
    },
    toggleShowPassword() {
      try {
        console.log('Password toggled!')
        const passwordForm = document.getElementById('passwordForm')
        if (passwordForm.type === 'password') {
          passwordForm.type = 'text'
        } else {
          passwordForm.type = 'password'
        }
      } catch (error) {
        this.updateUserMessage = 'Failed to toggle password field'
      }
    },
    updateUserInfo() {
      Api.patch(`/users/${this.relatedUser._id}`, {
        email: document.getElementById('emailForm').value,
        username: document.getElementById('usernameForm').value,
        password: document.getElementById('passwordForm').value
      }).then(
        this.updateUserMessage = 'User has been updated! You will be returned to your profile!',
        setTimeout(() => {
          this.returnToProfile()
        }, 3000)).catch(() => {
        this.updateUserMessage = 'Failed to update user information'
      })
    },
    returnToProfile() {
      try {
        window.location = '/profile'
      } catch (error) {
        this.updateUserMessage = 'Failed to return to profile'
      }
    },
    makeAdmin() {
      try {
        if (this.currentUser.userType === 'Admin' && this.relatedUser.userType !== 'Admin') {
          Api.patch(`/users/${this.relatedUser._id}`, {
            userType: 'Admin'
          })
          this.updateUserMessage = `Successfully made ${this.relatedUser.username} into an admin.`
          setTimeout(() => {
            this.updateUserMessage = ''
            this.returnToProfile()
          }, 5000)
        }
      } catch (error) {
        this.updateUserMessage = 'Failed to turn user into an admin'
      }
    },
    makeUser() {
      try {
        if (this.currentUser.userType === 'Admin' && this.relatedUser.userType === 'Admin') {
          Api.patch(`/users/${this.relatedUser._id}`, {
            userType: 'User'
          })
          this.updateUserMessage = `Successfully made ${this.relatedUser.username} into a user.`
          setTimeout(() => {
            this.updateUserMessage = ''
            this.returnToProfile()
          }, 5000)
        }
      } catch (error) {
        this.updateUserMessage = 'Failed to turn admin into a user'
      }
    },
    checkAdminButtonRights() {
      try {
        const adminButton = document.getElementById('makeUserAdminButton')
        const userButton = document.getElementById('makeAdminUserButton')
        if (this.currentUser.userType === 'Admin' && this.relatedUser.userType !== 'Admin') {
          adminButton.style.display = 'block'
          userButton.style.display = 'none'
        } else if (this.currentUser.userType === 'Admin' && this.relatedUser.userType === 'Admin') {
          adminButton.style.display = 'none'
          userButton.style.display = 'block'
        } else {
          adminButton.style.display = 'none'
          userButton.style.display = 'none'
        }
      } catch (error) {
        this.updateUserMessage = 'Failed to access certain elements'
      }
    }
  }
}

</script>

<style>

#profileOptionsContainer {
  background: white;
  padding: 2em;
}

#buttonRow {
  padding: 2em;
}

#updateUserInfoButton {
  background-color: #2c3e50;
}

#togglePasswordButton {
  background-color: #2c3e50;
}

</style>
