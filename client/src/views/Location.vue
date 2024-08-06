<template>
<div>
    <h1> Locations </h1>
    <b-container fluid="md" class="myContainer" v-if="!deleted && !deleteErrorMessage&& !errorMessage">
     <b-col>
         <label> Search : </label>
        <b-input type="text" v-model="search" placeholder="search locations"/>
     </b-col>
    <b-row class="vdivider"/>
    <b-col>
      <b-button v-if="adminUser === true && locations.length > 0" variant="danger" @click="deleteall">Delete All Locations</b-button>
    </b-col>
    <b-row class="divider"/>
    <b-col>
    <b-button v-if="adminUser === true" @click="$router.push('/addlocations')">Add New Location</b-button>
    </b-col>
    <div>
      <div v-if="locations.length < 1">
        <b-card title="Seems like no locations been added yet" border-variant="0">
          <b-row>
            <b-col class="d-none d-md-block mt-3"></b-col>
            <b-col>We have no data of locations to present at this moment</b-col>
            <b-col class="d-none d-md-block mt-3"></b-col>
          </b-row>
        </b-card>
      </div>
      <div v-else>
        <b-card-group id="location" v-for="location in filteredLocations" :per-page="perPage" v-bind:key="location._id">
            <b-card :title=location.name class="mb-2 border-success">
              <hr>
              <b-row>
                <b-col class="d-none d-lg-block"></b-col>
                <b-col>
                    <b-card-text><b>{{location.city}}</b></b-card-text>
                </b-col>
                <b-col class="d-none d-lg-block"></b-col>
              </b-row>
              <b-row>
                <b-col class="d-none d-lg-block"></b-col>
                <b-col>
                    <b-card-text>{{location.street}}</b-card-text>
                </b-col>
                <b-col class="d-none d-lg-block"></b-col>
              </b-row>
              <b-row>
                <b-col class="d-none d-lg-block"></b-col>
                <b-col>
                    <b-card-text>{{location.zipcode}} {{location.city}}</b-card-text>
                </b-col>
                <b-col class="d-none d-lg-block"></b-col>
              </b-row>
              <b-row>
                <b-col class="d-none d-lg-block"></b-col>
                <b-col>
                    <b-card-text>{{location.country}}</b-card-text>
                </b-col>
                <b-col class="d-none d-lg-block"></b-col>
              </b-row>
              <b-row>
                <b-col class="d-none md-block"></b-col>
                <b-col>
                <b-button v-if="adminUser === true" variant="danger" @click="deleteRelatedItemsAndReviews(location._id)">X</b-button>
                <b-row v-if="adminUser === true" class="divider"/>
                <b-button @click="$router.push('/locations/'+location._id)">More info</b-button>
                <b-row v-if="adminUser === true" class="divider"/>
                <b-button v-if="adminUser === true" @click="$router.push('/locations/edit/'+location._id)">Edit Details of Item</b-button>
                <b-row v-if="adminUser === true" class="divider"/>
                <b-button v-if="adminUser === true" @click="$router.push('/locations/editAll/'+location._id)">Edit Item</b-button>
                </b-col>
                <b-col class="d-none md-block"></b-col>
              </b-row>
            </b-card>
        </b-card-group>
        <b-pagination-nav v-model="currentPage" :link-gen="generateLink" :total-rows="rows" :number-of-pages="pageCount" :per-page="2" align="center" aria-controls="location" use-router></b-pagination-nav>
      </div>
    </div>
    </b-container>
                <b-col v-if="deleted">
            <h5>
            No Locations Here!
            </h5>
                </b-col>
   <b-col v-if=errorMessage>
     <h3>{{detailedErrorMessage}}</h3>
            </b-col>
   <b-col v-if=deleteErrorMessage>
     <h3>{{detailedErrorMessage}}</h3>
            </b-col>
</div>
</template>
<script>
import { Api } from '@/Api'
export default {
  mounted() {
    this.getUserData()
    console.log('PAGE is loaded!')
    console.log(this.currentPage)
    if (this.currentPage === undefined) {
      this.currentPage = 1
    }
    Api.get(`/locations/page/${this.currentPage}`)
      .then(response => {
        this.pageCount = response.data.pages
        this.locations = response.data.locations
      })
      .catch(error => {
        this.locations = []
        this.errorMessage = true
        console.log(error)
        this.detailedErrorMessage = 'Failed to retrieve locations'
      })
      .then(() => {
        console.log('This runs every time after success or error.')
      })
  },
  methods: {
    deleteRelatedItemsAndReviews(locationId) {
      try {
        Api.get(`/items/locations/${locationId}`).then(itemResp => {
          this.relevantItems = itemResp.data
          this.relevantItems.forEach(item => {
            Api.get(`/items/${item._id}/reviews`).then(reviewResp => {
              this.relevantReviews = reviewResp.data
              this.relevantReviews.forEach(review => {
                this.removeReviewFromUser(review)
                this.deleteOneReview(review._id)
              })
            })
          })
          this.relevantItems.forEach(item => {
            this.deleteItem(item._id)
          })
        })
        this.deleteLocation(locationId)
        this.relevantItems = []
        this.relevantReviews = []
      } catch (error) {
        console.log(error)
        this.deleteErrorMessage = true
        this.detailedErrorMessage = 'Failed to delete item(s) and/or review(ss)'
      }
    },
    deleteItem(id) {
      Api.delete(`/items/${id}`)
        .then(response => {
          const index = this.items.findIndex(item => item._id === id)
          this.items.splice(index, 1)
          this.items = []
        }).catch(error => {
          console.log(error)
          this.deleteErrorMessage = true
          this.detailedErrorMessage = 'Failed to delete item'
        })
    },
    removeReviewFromUser(review) {
      Api.delete(`/users/${review.owner}/reviews/${review._id}`)
        .then(response => {
          console.log('Removed review from owner')
        }).catch(error => {
          console.log(error)
          this.deleteErrorMessage = true
          this.detailedErrorMessage = 'Failed to remove review from user'
        })
    },
    deleteOneReview(reviewId) {
      try {
        console.log('Removing review')
        Api.delete(`/reviews/${reviewId}`)
      } catch (error) {
        console.log(error)
        this.deleteErrorMessage = true
        this.detailedErrorMessage = 'Failed to delete review'
      }
    },
    deleteLocation(id) {
      console.log('Delete location with id')
      Api.delete(`/locations/${id}`)
        .then(response => {
          const index = this.locations.findIndex(location => location._id === id)
          this.locations.splice(index, 1)
        }).catch(error => {
          this.deleteErrorMessage = true
          console.log(error)
          this.detailedErrorMessage = 'Failed to delete location'
        })
    },
    generateLink(pageNumber) {
      // loaded too many times (loads for each card in list)
      return {
        getData: this.getNewPage(),
        path: '/locations',
        query: { page: pageNumber }
      }
    },
    getNewPage() {
      console.log(this.currentPage)
      Api.get(`/locations/page/${this.currentPage}`)
        .then(response => {
          this.pageCount = response.data.pages
          this.locations = response.data.locations
        })
        .catch(error => {
          this.locations = []
          this.errorMessage = true
          console.log(error)
          this.detailedErrorMessage = 'Failed to retrieve locations'
        })
        .then(() => {
          console.log('This runs every time after success or error.')
        })
    },
    deleteall: function () {
      try {
        Api.get('/locations').then(locationResponse => {
          this.relevantLocations = locationResponse.data.locations
          this.relevantLocations.forEach(location => {
            this.deleteRelatedItemsAndReviews(location._id)
          })
        })
      } catch (error) {
        this.errorMessage = true
        this.detailedErrorMessage = 'Failed to delete all locations'
      }
    },
    async getUserData() {
      try {
        // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            const userInfo = await Api.get(`/users/${userid}`).catch(error => {
              console.log(error)
            })
            if (userInfo.data.userType === 'Admin') {
              console.log(userInfo.data.userType)
              this.adminUser = true
            } else if (userInfo.data.userType === 'User') {
              this.adminUser = false
            }
          }
        }
      } catch (error) {
        console.log(error)
        this.errorMessage = true
        this.detailedErrorMessage = 'Failed to retrieve your account information'
      }
    }
  },
  data() {
    return {
      locations: [],
      search: '',
      pageCount: 1,
      perPage: 10,
      currentPage: this.$route.params.page,
      deleted: false,
      deleteErrorMessage: false,
      errorMessage: false,
      detailedErrorMessage: '',
      relevantItems: [],
      relevantReviews: [],
      relevantLocations: [],
      adminUser: false
    }
  },
  computed: {
    filteredLocations: function () {
      return this.locations.filter((location) => {
        return location.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    rows() {
      return this.locations.length
    }
  }
}
</script>
<style scoped>
#location {
    margin: 70px;
    width: auto;
}
.divider{
    width:50px;
    height:auto;
    display:inline-block;
}
.vdivider{
    height:70px;
    width:auto;
    display:inline-block;
}
.vmdivider{
    height:70px;
    width:auto;
    display:inline-block;
}
label{
    color: black;
}
h3{
  color:red;
}
</style>
