<template>
  <b-container id="reviewListContainer">
    <b-row><b-col><h1>Review List:</h1></b-col></b-row>
    <b-row>
      <b-col>
        <b-button variant="danger" id="removeAllReviewsButton" @click="deleteAllReviews">Delete All Reviews</b-button>
      </b-col>
    </b-row>
    <b-row class="col-11" v-for="review in reviews" :key="review._id">
      <b-col>
        <review-component v-bind:review="review" v-on:del-review="deleteReview" v-on:toggle-review-modal="showModalWindow" v-on:update-review-info="updateReviewInfo"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Api } from '../Api'
import ReviewComponent from './reviewComponent'

export default {
  components: { 'review-component': ReviewComponent },
  mounted() {
    this.loadReviews()
  },
  data() {
    return {
      reviews: []
    }
  },
  methods: {
    loadReviews() {
      Api.get('/reviews/').then(resp => {
        this.reviews = resp.data
      }).catch(() => {
        this.errorMessage = 'Something went wrong when importing reviews'
      })
    },
    deleteReview(reviewId) {
      console.log(reviewId)
      Api.delete(`/reviews/${reviewId}`).then(resp => {
        const reviewIndex = this.reviews.findIndex(review => review._id === reviewId)
        this.users.splice(reviewIndex, 1)
        this.errorMessage = 'Successfully deleted review!'
        setTimeout(() => {
          this.errorMessage = ''
        }, 5000)
      }).catch(() => {
        this.errorMessage = `Could not delete review with id: ${this.reviews._id}`
      })
    },
    deleteAllReviews() {
      console.log('Deleting all reviews') // Clear array content reactive src: https://stackoverflow.com/questions/57834381/vue-js-clearing-an-array-content-and-reactivity-issues
      Api.delete('/reviews/').then(() => {
        this.reviews.splice(0)
        console.log('All reviews deleted!')
      }).catch(() => {
        this.errorMessage = 'Could not delete all reviews!'
      })
    },
    showModalWindow(reviewId) {
      try {
        const reviewModalVar = document.getElementById(`reviewCard${reviewId}`)
        if (reviewModalVar.style.display === 'block') {
          reviewModalVar.style.display = 'none'
        } else {
          reviewModalVar.style.display = 'block'
        }
      } catch (error) {
        this.errorMessage = 'Failed to access review element'
      }
    },
    updateReviewInfo(reviewId) {
      try {
        const reviewTitleVar = document.getElementById(`reviewTitleField${reviewId}`).value
        const reviewDescriptionVar = document.getElementById(`reviewDescriptionField${reviewId}`).value
        const reviewRatingVar = document.getElementById(`reviewRatingField${reviewId}`).value

        Api.put(`/reviews/${reviewId}`, {
          title: reviewTitleVar,
          description: reviewDescriptionVar,
          rating: reviewRatingVar
        }).then(() => {
          this.errorMessage = `Successfully updated review with id: ${reviewId}`
          setTimeout(() => { this.errorMessage = '' }, 5000)
        }).catch(() => {
          this.errorMessage = `Could not update review with id: ${reviewId}`
        })
      } catch (error) {
        this.errorMessage = 'Failed to access review elements'
      }
    }
  }
}

</script>
