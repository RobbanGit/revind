<template>
  <b-container id="userListContainer">
    <b-row>
    <img src="../../../images/projectImages/LackAbility.png" id="LackAbilityImg">
    </b-row>
    <b-row>
        <b-dropdown id="navViewSelector" text="Select View" toggle-class="nav-link-custom">
          <b-dropdown-item id="navViewUsers" @click="changeDynamicComponent('userlist-component')">Users</b-dropdown-item>
          <b-dropdown-item id="navViewItems" @click="changeDynamicComponent('itemlist-component')">Items</b-dropdown-item>
          <b-dropdown-item id="navViewLocations" @click="changeDynamicComponent('locationlist-component')">Locations</b-dropdown-item>
          <b-dropdown-item id="navViewReviews" @click="changeDynamicComponent('reviewlist-component')">Reviews</b-dropdown-item>
          <b-dropdown-item id="navViewSuggestions" @click="changeDynamicComponent('suggestionlist-component')">Suggestions</b-dropdown-item>
        </b-dropdown>
      <b-button id="clearViewButton" @click="changeDynamicComponent(null)">Clear View</b-button>
    </b-row>
    <b-row>
      <b-col>
        <h1 id="errorMessageId">{{errorMessage}}</h1>
      </b-col>
    </b-row>
    <b-row>
      <component id="componentId" :is="this.dynamicComponent"></component>
    </b-row>

  </b-container>
</template>
// Separate component for users, so that we can switch between the different entities via a dropdown menu. Depending on what the user picked, we display a different component
<script> // dynamic component loading, from a dropdown menu
import { Api } from '../Api'
import UserListComponent from '../components/userList'
import ItemListComponent from '../components/itemList'
import LocationListComponent from '../components/locationList'
import ReviewListComponent from '../components/reviewList'
import SuggestionListComponent from '../components/suggestionList'

export default {
  components: {
    'userlist-component': UserListComponent,
    'itemlist-component': ItemListComponent,
    'locationlist-component': LocationListComponent,
    'reviewlist-component': ReviewListComponent,
    'suggestionlist-component': SuggestionListComponent
  },
  mounted() {
    this.getUserData()
  },
  data() {
    return {
      currentUser: {
        _id: '',
        email: '',
        username: '',
        userType: '',
        password: ''
      },
      errorMessage: null,
      dynamicComponent: null
    }
  },
  methods: {
    getUserData() {
      try {
        const lackAbilityImage = document.getElementById('LackAbilityImg')
        const selectViewButton = document.getElementById('navViewSelector')
        const clearViewButton = document.getElementById('clearViewButton')
        selectViewButton.style.display = 'none'
        clearViewButton.style.display = 'none'
        lackAbilityImage.style.display = 'block'
        // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            const userInfo = Api.get(`/users/${userid}`).catch(error => {
              console.log(error)
              this.errorMessage = 'Failed when retrieving user information'
            })
            userInfo.then(resp => {
              this.currentUser._id = resp.data._id
              this.currentUser.email = resp.data.email
              this.currentUser.username = resp.data.username
              this.currentUser.userType = resp.data.userType
              this.checkAccessRights()
            }).catch(error => {
              console.log(error)
              this.errorMessage = 'Failed when accessing user information'
            })
          }
        } else {
          this.redirectToHome()
        }
      } catch (error) {
        console.log(error)
      }
    },
    checkAccessRights() {
      try {
        console.log(this.currentUser)
        const lackAbilityImage = document.getElementById('LackAbilityImg')
        const selectViewButton = document.getElementById('navViewSelector')
        const clearViewButton = document.getElementById('clearViewButton')
        if (this.currentUser.userType === 'Admin') {
          lackAbilityImage.style.display = 'none'
          selectViewButton.style.display = 'block'
          clearViewButton.style.display = 'block'
        } else {
          selectViewButton.style.display = 'none'
          clearViewButton.style.display = 'none'
          lackAbilityImage.style.display = 'block'
          this.redirectToHome()
        }
      } catch (error) {
        this.errorMessage = 'Failed to load page elements'
      }
    },
    redirectToHome() {
      try {
        setTimeout(() => {
          window.location = '/'
        }, 5000)
      } catch (error) {
        this.errorMessage = 'Failed to redirect to home'
      }
    },
    changeDynamicComponent(component) {
      try {
        this.dynamicComponent = component
      } catch (error) {
        this.errorMessage = 'Failed to load dynamic component'
      }
    }
  }
}

</script>

<style>

#componentId {
  display: inline-block;
  width: 100%;
  height: 100%;
}

#LackAbilityImg {
  width: 100%;
  height: 100%;
}

#clearViewButton {
  margin: 0.5em;
  background-color: #2c3e50;
}

#navViewSelector {
  margin: 0.5em;
  background-color: #2c3e50;
  border-radius: 0.5em;
}

</style>
