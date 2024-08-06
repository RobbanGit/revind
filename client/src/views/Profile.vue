<template>
  <b-container id="UserContainer">
    <b-row>
      <b-col><h1>{{this.relatedUser.username}}</h1></b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="accountheader">Account info:</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="accountheader">Email: {{this.relatedUser.email}}</p>
      </b-col>
      <b-col>
        <p class="accountheader">Username: {{this.relatedUser.username}}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-button id="optionsButton" @click="gotoProfileOptions()" block>Account Options</b-button>
    </b-row>
    <h3>Your Reviews:</h3>
    <div v-if="editActive !== true">
      <div v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review._id">
          <b-card class="mt-3 mb-2" :title="review.title">
            <b-rating class="mb-3" :value="review.rating" color="warning" size="sm" inline no-border disabled></b-rating>
            <b-button v-if="currentUser._id === relatedUser._id || currentUser.userType === 'Admin'" variant="danger" @click="deleteReview(review._id)">X</b-button>
            <p>{{review.description}}</p>
            <b-button v-if="review.product !== undefined" @click="redirProductpage(review.product)">Visit Item Page</b-button>
            <b-button v-else-if="review.location !== undefined " @click="redirLocationpage(review.location)">Visit Location Page</b-button>
            <b-button class="mt-3" :pressed.sync="editActive" block variant="info" @click="setReviewId(review)">Edit</b-button>
          </b-card>
        </div>
      </div>
      <div v-else>
        <b-card class="mt-3 mb-2" border-variant="0">
          <h5>You have not made any reviews 😢</h5>
          <b-row>
            <b-col class="d-none d-md-block"></b-col>
            <b-col> <p>Want to write your first review? <br> Here you can browse all products</p></b-col>
            <b-col class="d-none d-md-block"></b-col>
          </b-row>
          <b-row>
            <b-col class="d-none d-md-block"></b-col>
            <b-col>
              <b-button pill @click="$router.push('/items')" variant="success">Browse Items</b-button>
            </b-col>
            <b-col class="d-none d-md-block"></b-col>
          </b-row>
        </b-card>
      </div>
    </div>
    <div v-else>
      <b-alert v-model="successMessage" :variant="variant" dismissible>{{confirmation}}</b-alert>
      <b-button :pressed.sync="editActive">Cancel</b-button>
      <b-card class="border-info" title="Editing Review">
        <b-form @submit="onSubmit">
            <b-form-group description="Write your review here! Don't forget the rating">
              <b-form-rating class="mb-3" variant="warning" inline no-border v-model="updatedReview.rating" show-value required></b-form-rating>
              <h3>Title:</h3>
              <b-input class="mb-2" placeholder="Title" v-model="updatedReview.title"></b-input>
              <h3>Review:</h3>
              <b-textarea placeholder="Your review" v-model="updatedReview.description"></b-textarea>
            </b-form-group>
            <b-button type="submit" variant="success" @click="patchReview; successMessage=true">Update review</b-button>
          </b-form>
        </b-card>
    </div>
  </b-container>
</template>

<script>

import { Api } from '../Api'

export default { // ^^ If this.relatedUser._id === null -> use this.currentUser
  mounted() {
    this.getUserData()
  },
  data() {
    return {
      currentUser: { // You
        _id: '',
        email: '',
        username: '',
        userType: '',
        password: ''
      },
      relatedUser: { // Profile related to the user, either you or someone else.
        _id: this.$route.params.userId,
        email: '',
        username: '',
        userType: '',
        password: ''
      },
      updatedReview: {
        _id: '',
        title: '',
        description: '',
        rating: 0,
        owner: null,
        product: ''
      },
      reviews: [],
      thingReviewed: null,
      editActive: false,
      successMessage: false,
      confirmation: '',
      variant: '',
      errorMessage: ''
    }
  },
  methods: {
    async getUserData() {
      try {
        // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            await Api.get(`/users/${userid}`).then(resp => {
              this.currentUser.userType = resp.data.userType
              this.currentUser.email = resp.data.email
              this.currentUser.username = resp.data.username
              this.currentUser._id = userid
            }).catch(error => {
              console.log(error)
              this.errorMessage = 'Failed to retrieve user information'
            })
          } else {
            console.log('user not logged in')
          }
        } else {
          console.log('No userId cookie found')
          document.getElementById('optionsButton').style.display = 'none'
        }
      } catch (error) {
        this.errorMessage = 'Failed to retrieve user information'
      }
      this.checkCurrentUserType()
      this.retrieveUserInfo()
      await this.retrieveUserReviews(this.relatedUser._id)
    },
    async onSubmit(event) {
      if (this.updatedReview.description.length < 1000) {
        event.preventDefault()
        const postSuccess = await this.patchReview()
        if (postSuccess) {
          setTimeout(function setEditNotActive() {
            this.editActive = !this.editActive
          }, 5000)
        }
      }
    },
    async patchReview() {
      try {
        const reviewData = await Api.patch(`/reviews/${this.updatedReview._id}`,
          {
            title: this.updatedReview.title,
            description: this.updatedReview.description,
            rating: this.updatedReview.rating
          })
        const statusCode = reviewData.status
        if (statusCode === 201) {
          this.variant = 'success'
          this.confirmation = 'Successfully submitted!'
          return true
        }
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Something went wrong! Couldn\'t submit form'
        return false
      }
    },
    retrieveUserInfo() {
      Api.get(`/users/${this.relatedUser._id}`).then(resp => {
        this.relatedUser = resp.data
      }).catch(error => {
        console.log(error)
      })
    },
    async retrieveUserReviews(userId) {
      // should return all the reviews that a specific user have written.
      await Api.get(`/users/${userId}/reviews`).then(resp => {
        this.reviews = resp.data
      }).catch(error => {
        console.log(error)
      })
      console.log(`reviews:${JSON.stringify(this.reviews.review)}`)
    },
    retrieveItemInfo(itemId) {
      // get review index, send item index to the Api('items id endpoint'), put item info inside the index of the review(review[reviewId].item), grab that info
      // e.g review.item.title for the product title, might be a solution.
      const reviewIndex = this.reviews.findIndex(review => review.product === itemId)
      Api.get(`/items/${itemId}`).then(resp => {
        this.reviews[reviewIndex].relatedProduct = resp.data
      }).catch(error => {
        console.log(error)
      })
    },
    checkCurrentUserType() {
      try {
        const OptionsButton = document.getElementById('optionsButton')
        if (this.currentUser._id !== '') {
          if (this.relatedUser._id === this.currentUser._id || this.currentUser.userType === 'Admin') {
            OptionsButton.style.display = 'block'
          } else {
            OptionsButton.style.display = 'none'
          }
        }
      } catch (error) {
        this.errorMessage = 'Failed to access a page element'
      }
    },
    setReviewId(revId) {
      this.getReview(revId._id)
      try {
        this.updatedReview._id = revId._id
      } catch (error) {
        this.errorMessage = 'Failed to access relevant element information'
      }
    },
    getReview(reviewID) {
      Api.get(`/reviews/${reviewID}`).then(resp => {
        const reviewData = resp.data
        this.updatedReview._id = reviewData._id
        this.updatedReview.title = reviewData.title
        this.updatedReview.description = reviewData.description
        this.updatedReview.owner = this.currentUser._id
        this.updatedReview.rating = reviewData.rating
        console.log(reviewData)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteReview(reviewId) {
      Api.delete(`/users/${this.relatedUser._id}/reviews/${reviewId}`).then(() => {
        Api.delete(`/reviews/${reviewId}`).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    gotoProfileOptions() {
      try {
        const path = this.$route.params.userId
        window.location = '/profile-options/' + path
      } catch (error) {
        this.errorMessage = 'Failed to redirect to profile options'
      }
    },
    redirProductpage(prodID) {
      window.location = '/items/' + prodID
    },
    redirLocationpage(locID) {
      window.location = '/locations/' + locID
    },
    redirEmptyProdPage(locID) {
      window.location = '/items/'
    }
  }
}

</script>

<style scoped>

#optionsButton {
  background-color: #2c3e50;
  margin: 1em;
}
.accountheader{
  font-size: 1.2em;
}

</style>
