<template>
<div>
    <h1> Products</h1>
    <b-container fluid="md" class="myContainer">
      <b-col>
        <label> Search : </label>
        <b-input type="text" v-model="search" placeholder="search items"/>
      </b-col>
        <b-row class="vdivider"/>
      <b-col>
        <b-button  v-if="adminUser && items.length > 0" variant="danger" @click="deleteall">Delete All Items</b-button>
      </b-col>
        <b-row class="divider"/>
      <b-col>
        <div v-if="adminUser && locationCount > 0">
          <b-button @click="$router.push('/additems')">Add New Item</b-button>
        </div>
        <div v-else-if="adminUser && locationCount < 1">
          <h3>You cannot add products without any locations added</h3>
          <b-button @click="$router.push('/addlocations')">Add New Location</b-button>
        </div>
      </b-col>
        <div id="item" tag="article">
            <div v-if="items.length < 1">
              <b-card title="Seems like no products been added yet" border-variant="0">
                <b-row>
                  <b-col class="d-none d-md-block mt-3"></b-col>
                  <b-col>We have no data of products to present at this moment</b-col>
                  <b-col class="d-none d-md-block mt-3"></b-col>
                </b-row>
              </b-card>
            </div>
            <div v-else>
              <div v-for="item in filteredItems" v-bind:key="item._id">
              <b-card v-if="adminUser" id="item" class="mb-2 border-success" :title="item.title">
                <b-row> {{item.description}} </b-row>
                <hr>
                <b-row>
                  <b-col cols="5"></b-col>
                  <b-col cols="2">
                    <b>Price</b> : €{{item.price}}
                  </b-col>
                  <b-col cols="5"></b-col>
                </b-row>
                <b-button @click="$router.push('/items/'+item._id)">More info</b-button>
                <b-row class="divider"/>
                <b-button @click="$router.push('/items/edit/'+item._id)">Edit Details of Item</b-button>
                <b-row class="divider"/>
                <b-button @click="$router.push('/items/editAll/'+item._id)">Edit Item</b-button>
                <b-row class="divider"/>
                <b-button variant="danger" v-on:click="deleteItemAndRelatedReviews(item._id)">X</b-button>
              </b-card>
              <b-card v-if="!adminUser" id="item" class="mb-2 border-success" :title="item.title">
                <b-row> {{item.description}} </b-row>
                <hr>
                <b-row>
                  <b-col cols="4"></b-col>
                  <b-col cols="4">
                    <b>Price</b> : €{{item.price}}
                  </b-col>
                  <b-col cols="4"></b-col>
                </b-row>
                <b-button @click="$router.push('/items/'+item._id)">More info</b-button>
              </b-card>
              </div>
            </div>
        </div>
    </b-container>
    <b-col v-if="deleted">
      <h5> No Items Here!</h5>
    </b-col>
    <b-col v-if="errorMessage">
      <h3> {{detailedErrorMessage}}</h3>
    </b-col>
    <b-col v-if="deleteErrorMessage">
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
    Api.get('/items') // retrieves information of all items
      .then(response => {
        this.items = response.data.items
        if (this.items.length === 0) {
          this.errorMessage = true
        }
      })
      .catch(error => {
        this.items = []
        console.log(error)
        this.errorMessage = true
        this.detailedErrorMessage = 'Failed to load products'
      })
      .then(() => {
        console.log('This runs every time after success or error when getting items.')
      })
    Api.get('/locations') // retrieves information of all locations
      .then(response => {
        this.locationCount = response.data.locations.length
      })
      .catch(error => {
        this.items = []
        console.log(error)
        this.errorMessage = true
        this.detailedErrorMessage = 'Failed to load products'
      })
      .then(() => {
        console.log('This runs every time after success or error of getting location count.')
      })
  },
  methods: {
    deleteItemAndRelatedReviews(itemId) {
      try {
        Api.get(`/items/${itemId}/reviews`).then(resp => { // retrieve all reviews of an item
          this.relatedReviews = resp.data
          this.relatedReviews.forEach(review => {
            this.deleteOneReview(review._id)
            Api.delete(`/users/${review.owner}/reviews/${review._id}`).then(resp => {
              console.log(`Removed review from user: ${resp.data.username}`)
            }).catch(() => {
              console.log(`Failed to remove review from user's array(${JSON.stringify(resp.data.review)})`)
            })
          })
        })
      } catch (error) {
        console.log(error)
        this.deleteErrorMessage = true
        this.detailedErrorMessage = 'Failed to delete item(s) and/or review(s)'
      }
      console.log('Deleting item')
      this.deleteItem(itemId)
    },
    deleteOneReview(reviewId) {
      console.log('Deleting review')
      Api.delete(`/reviews/${reviewId}`).catch(error => { // deletes a specific review
        console.log(error)
        this.deleteErrorMessage = true
        this.detailedErrorMessage = 'Failed to delete review'
      })
    },
    deleteItem(id) {
      console.log('Delete item')
      Api.delete(`/items/${id}`) // deletes a specific item
        .then(response => {
          const index = this.items.findIndex(item => item._id === id)
          this.items.splice(index, 1)
        }).catch(error => {
          console.log(error)
          this.deleteErrorMessage = true
          this.detailedErrorMessage = 'Failed to delete product'
        })
    },
    deleteall: function () {
      Api.get('/items/').then(response => {
        this.relevantItems = response.data.items
        this.relevantItems.forEach(item => { // go over each item, and call a function to remove its reviews and then the item itself
          this.deleteItemAndRelatedReviews(item._id)
        })
        this.deleted = true
        this.items = []
      }).catch(error => {
        console.log(error)
        this.deleteErrorMessage = true
        this.detailedErrorMessage = 'Failed to delete all products'
      })
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
            this.currentUser._id = userInfo.data._id
            this.currentUser.email = userInfo.data.email
            this.currentUser.username = userInfo.data.username
            this.currentUser.userType = userInfo.data.userType
            if (this.currentUser.userType === 'Admin') {
              console.log(this.currentUser.userType)
              this.adminUser = true
            } else if (this.currentUser.userType === 'User') {
              this.adminUser = false
            }
          }
        }
      } catch (error) {
        this.detailedErrorMessage = 'Failed to retrieve user information'
      }
    }
  },
  computed: {
    filteredItems: function () {
      return this.items.filter((item) => {
        return item.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  data() {
    return {
      items: [],
      locationCount: '',
      search: '',
      deleted: false,
      deleteErrorMessage: false,
      errorMessage: false,
      detailedErrorMessage: '',
      relatedReviews: [],
      relatedItems: [],
      currentUser: {
        _id: null,
        email: '',
        username: '',
        userType: ''
      },
      adminUser: false
    }
  }
}
</script>
<style scoped>
p {
     width: 200px;
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
}
.divider{
    width:50px;
    height:auto;
    display:inline-block;
}
.vdivider{
    height:50px;
    width:auto;
    display:inline-block;
}
#item{
      margin: 20px auto;
}
label{
    color: black;
}
h3{
  color: red;
}
</style>
