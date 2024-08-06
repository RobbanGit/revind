<template>
  <div>
    <b-container class="d-none d-md-block">
      <b-row>
        <b-col>
          <b-card :title=item.title class="text-left text-uppercase font-weight-bold border pl-2">
          <b-row>
            <b-card-text id="title" class="text-left text-lowercase text-break font-weight-normal">{{item.description}}</b-card-text>
          </b-row>
          </b-card>
        </b-col>
        <!--Right side card if > md -->
        <b-col align-self="stretch" cols="3">
          <b-card id="details" :title=location.name class="border-top-0 border-success">
            <b-list-group id="details" class="border-0" flush>
              <b-list-group-item id="details">Street: {{location.street}}</b-list-group-item>
              <b-list-group-item id="details">City: {{location.city}}</b-list-group-item>
              <b-list-group-item id="details">Country: {{location.country}}</b-list-group-item>
              <b-list-group-item id="details">ZIP: {{location.zipcode}}</b-list-group-item>
              <b-list-group-item id="details" class="font-weight-bold">Price: €{{item.price}}</b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <hr class="d-xs-none d-md-block">
    <b-container class="d-block d-md-none">
      <b-card class="border-0">
        <b-row class="">
          <h2>{{item.title}}</h2>
        </b-row>
        <b-row>
          <p>{{item.description}}</p>
        </b-row>
      </b-card>
      <hr class="d-xs-block d-md-none">
    </b-container>
    <!--STORE DETAILS ON < MD-->
    <b-container class="d-block d-md-none">
      <b-button v-b-toggle.collapse-1 block variant="success">Store Info</b-button>
      <b-collapse id="collapse-1" class="mt-2">
        <b-card id="details" :title=location.name class="border-top-0 border-success">
          <b-list-group id="details" class="border-0" flush>
            <b-list-group-item id="details" class="font-weight-bold">Street: {{location.street}}</b-list-group-item>
            <b-list-group-item id="details" class="font-weight-bold">City: {{location.city}}</b-list-group-item>
            <b-list-group-item id="details" class="font-weight-bold">Country: {{location.country}}</b-list-group-item>
            <b-list-group-item id="details" class="font-weight-bold">ZIP: {{location.zipcode}}</b-list-group-item>
            <b-list-group-item id="details" class="font-weight-bold">Price: €{{item.price}}</b-list-group-item>
          </b-list-group>
        </b-card>
      </b-collapse>
      <hr class="d-xs-block d-md-none">
    </b-container>
    <b-container>
      <!-- add review small screen-->
      <b-alert v-model="successMessage" :variant="variant" dismissible>{{confirmation}}</b-alert>
      <b-button class="d-xs-block d-md-none" v-b-toggle.collapse-2 block variant="info">Write A Review</b-button>
      <b-collapse class="d-xs-block d-md-none mt-2" id="collapse-2">
        <b-card v-if="this.currentUser._id !== null" id="addReview" title="New Review" class="border-top-0 border-info">
          <b-form @submit="onSubmit">
            <b-card-text>Do you like it? Who do you think would appreciate this? Was it worth it?</b-card-text>
            <b-form-group description="Write your review here! Don't forget the rating">
              <b-form-rating class="mb-3" inline no-border v-model="newReview.rating" show-value required></b-form-rating>
              <b-input class="mb-2" placeholder="Title" v-model="newReview.title"></b-input>
              <b-textarea placeholder="Your review" v-model="newReview.description"></b-textarea>
            </b-form-group>
            <b-button type="submit" variant="success" @click="postReview;$router.push('/items/'+item._id); successMessage=true">Add review</b-button>
          </b-form>
        </b-card>
        <b-card v-else title="New Review" class="border-top-0 border-info">
          <h3>You need to be logged in to write reviews</h3>
          <b-col>
            <b-button class="mr-2" variant="success" @click="redirLogIn">Log in</b-button>
            <b-button class="ml-2" variant="success" @click="redirSignUp">Sign up</b-button>
          </b-col>
        </b-card>
      </b-collapse>
    </b-container>
    <b-container class="d-none d-md-block">
      <!-- add review md or bigger screen-->
      <b-card class="border-info" v-if="this.currentUser._id !== null" title="New Review">
        <b-form @submit="onSubmit">
            <b-card-text>Do you like it? Who do you think would appreciate this? Was it worth it?</b-card-text>
            <b-form-group description="Write your review here! Don't forget the rating">
              <b-form-rating class="mb-3" inline no-border v-model="newReview.rating" show-value required></b-form-rating>
              <b-input class="mb-2" placeholder="Title" v-model="newReview.title"></b-input>
              <b-textarea placeholder="Your review" v-model="newReview.description"></b-textarea>
            </b-form-group>
            <b-button type="submit" variant="success" @click="postReview; successMessage=true">Add review</b-button>
          </b-form>
        </b-card>
        <b-card v-else title="New Review" class="border-top-0 border-info">
          <h3>You need to be logged in to write reviews</h3>
          <b-col>
            <b-button class="mr-2" variant="success" @click="redirLogIn">Log in</b-button>
            <b-button class="ml-2" variant="success" @click="redirSignUp">Sign up</b-button>
          </b-col>
      </b-card>
    </b-container>
    <!--See reviews small screen-->
    <b-container v-if="reviews.length > 0" class="d-block d-md-none mt-3">
        <b-button class="mt-3" v-b-toggle.collapse-3 block variant="info">See Reviews</b-button>
        <b-collapse id="collapse-3">
          <div v-for="review in reviews" :key=review._id>
            <b-card class="mt-3 mb-2" :title="review.title">
              <b-button v-if="currentUser.userType === 'Admin'" id="deleteReviewButton" @click="deleteReview(review._id)" variant="danger" >X</b-button>
              <b-form-rating :value="review.rating" color="warning" size="sm" inline no-border disabled></b-form-rating>
              <p>{{review.description}}</p>
            </b-card>
          </div>
        </b-collapse>
    </b-container>
    <h2 class="mt-5" v-else>There are no reviews for this product yet!</h2>
    <!--See reviews md or larger-->
    <b-container class="d-none d-md-block mt-3">
      <div v-for="review in reviews" :key=review._id>
        <b-card class="mt-3 mb-2" :title="review.title">
          <b-button v-if="currentUser.userType === 'Admin'" id="deleteReviewButton" @click="deleteReview(review._id)" variant="danger" >X</b-button>
          <b-form-rating class="" :value="review.rating" color="warning" size="sm" inline no-border disabled></b-form-rating>
            <p>{{review.description}}</p>
        </b-card>
      </div>
    </b-container>
  </div>
</template>
<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      itemId: this.$route.params.id,
      rating: null,
      item: {},
      location: {},
      reviews: [],
      errorMessage: false,
      successMessage: false,
      confirmation: '',
      variant: '',
      newReview: {
        title: '',
        description: '',
        rating: 0,
        owner: null,
        product: ''
      },
      currentUser: {
        _id: null,
        email: '',
        username: '',
        userType: ''
      }
    }
  },
  methods: {
    deleteReview(reviewId) {
      Api.delete(`/reviews/${reviewId}`).then(response => {
        this.variant = 'success'
        this.confirmation = 'Successfully deleted review!'
        console.log(`Deleted review with id: ${reviewId}`)
        Api.delete(`/users/${response.data.owner}/reviews/${reviewId}`).then(resp => {
          console.log(`Removed review from user: ${resp.data.username}`)
        }).catch(() => {
          console.log(`Failed to remove review from user's array(${JSON.stringify(response.data.review)})`)
          this.variant = 'danger'
          this.confirmation = 'Failed to remove review from user'
        })
        const reviewIndex = this.reviews.findIndex(review => review._id === reviewId)
        this.reviews.splice(reviewIndex, 1)
      }).catch(() => {
        this.variant = 'danger'
        this.confirmation = 'Failed to delete review'
        console.log(`Failed to delete review with id: ${reviewId}`)
      })
    },
    async getUserData() {
      try {
        // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            const userInfo = await Api.get(`/users/${userid}`)
            console.log(userInfo.data)
            this.currentUser._id = userInfo.data._id
            this.newReview.owner = userInfo.data._id
            this.currentUser.email = userInfo.data.email
            this.currentUser.username = userInfo.data.username
            this.currentUser.userType = userInfo.data.userType
          }
        }
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Failed to retrieve user information'
      }
    },
    redirSignUp() {
      window.location = '/register'
    },
    redirLogIn() {
      window.location = '/login'
    },
    async postReview() {
      try {
        const reviewData = await Api.post('items/' + this.itemId + '/reviews', this.newReview)
        console.log(reviewData)
        this.confirmation = reviewData
        const statusCode = reviewData.status
        if (statusCode === 201) {
          this.variant = 'success'
          this.confirmation = 'Successfully submitted!'
          await this.assignReviewToUser(reviewData.data._id)
          return true
        }
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Something went wrong! Couldn\'t submit form'
        return false
      }
    },
    async assignReviewToUser(reviewId) {
      console.log('Entered AssignReviewToUser')
      try {
        await Api.post(`users/${this.currentUser._id}/reviews`, {
          reviewId: reviewId
        }).then(response => {
          if (response.status === 201) {
            console.log(`Saved review to user: ${response.data.owner}`)
          } else {
            console.log(`Failed to save review to user: ${response.data.owner}`)
            this.variant = 'danger'
            this.confirmation = 'Failed to save review to user'
          }
        }
        )
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Could not assign review to user!'
        console.log('Failed to save review to user')
      }
    },
    async onSubmit(event) {
      console.log(this.newReview)
      if (this.newReview.description.length < 1000) {
        event.preventDefault()
        const postSuccess = await this.postReview()
        if (postSuccess) {
          this.onReset(event)
        }
      }
    },
    onReset(event) {
      event.preventDefault()
      this.newReview.title = ''
      this.newReview.description = ''
      this.newReview.rating = 0
    }
  },
  mounted() {
    console.log('page is loaded')
    this.getUserData()
    Api.get('/items/' + this.itemId).then(response => {
      console.log(response)
      this.newReview.product = response.data._id
      this.item = response.data
      this.location = this.item.location
      console.log(this.item)
      console.log(this.location)
    }).catch(error => {
      this.item = []
      this.location = []
      this.errorMessage = true
      console.log(error)
    })
    Api.get('items/' + this.itemId + '/reviews').then(response => {
      console.log(response)
      this.reviews = response.data
    }).catch(error => {
      this.reviews = []
      this.errorMessage = true
      console.log(error)
    })
  }
}
</script>
<style>
.vdivider{
    height:20px;
    width:auto;
    display:inline-block;
}
.hdivider{
    height:50px;
    width:auto;
    display:inline-block;
}
#details{
  background-color: #c6eec5;
}

#deleteReviewButton {
  float: right;
}
</style>
