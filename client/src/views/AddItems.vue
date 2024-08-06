<template>
    <div id="add-item">
        <h2>Add a New Item </h2>
        <b-form v-if="!submitted">
            <label>Title:</label>
            <b-input type="text" v-model.lazy="newItem.Title" required />
            <label> Description of Item: </label>
            <b-textarea v-model.lazy="newItem.Description"></b-textarea>
            <br>
            <label>Price:</label>
            <b-input type="text" v-model.lazy="newItem.Price" required />
            <label>Location:</label>
            <b-select v-model="newItem.Location" v-on="select"> Choose a location
                <option v-for="location in locations" v-bind:key="location._id" >{{location.name}}</option>
            </b-select >
            <b-col> <b-button v-on:click.prevent="post" v-on:click="getItemId()" id="add-button"> Add Item </b-button> </b-col>
        </b-form>
         <b-col v-if=errorMessage>
           <p>{{detailedErrorMessage}}</p>
            </b-col>
        <b-col v-if="submitted">
            <h5>
            Your Item Has Now Been Added!
            </h5>
        </b-col>
        <b-col id="preview">
         <h3> Preview</h3>
        <h3> Title : {{newItem.Title}}</h3>
        <h3> Description</h3>
        <h3> {{newItem.Description}} </h3>
        <h3> Price : {{newItem.Price}}</h3>
        <h3> Location : {{newItem.Location}}</h3>
        </b-col>
    </div>
</template>
<script>
import { Api } from '@/Api'
export default {
  data() {
    return {
      newItem: {
        Title: '',
        Description: '',
        Price: '',
        Location: '',
        LocationId: ''
      },
      locations: [],
      submitted: false,
      errorMessage: false,
      detailedErrorMessage: ''
    }
  },
  methods: {
    post: async function () {
      Api.post('/items', {
        title: this.newItem.Title,
        description: this.newItem.Description,
        price: this.newItem.Price,
        location: await this.getItemId()
      }).then(response => {
        console.log(response)
        this.submitted = true
      }).catch(error => {
        this.newItem = []
        this.errorMessage = true
        console.log(error)
        this.detailedErrorMessage = 'Could not retrieve items'
      })
    },
    async getItemId() {
      const locationInfo = await this.locations.find(element => element.name === this.newItem.Location)
      return locationInfo._id
    }
  },
  mounted() {
    console.log('PAGE is loaded!')
    Api.get('/locations')
      .then(response => {
        console.log(response)
        this.locations = response.data.locations
        console.log(this.locations)
      })
      .catch(error => {
        this.locations = []
        this.errorMessage = true
        console.log(error)
        this.detailedErrorMessage = 'Could not retrieve locations'
      })
      .then(() => {
        console.log('This runs every time after success or error.')
      })
  }
}
</script>

<style scoped>
#add-item*{
    box-sizing: border-box;
}
#add-item {
    margin: 20px auto;
}
label{
    display: block;
    margin: 20px 0 10px;
}
b-input[type="text"],textarea{
    display: inline;
    width: 80%;
    padding: 8px
}
#add-button {
    margin: 20px 0 10px;
}
#preview {
    padding: auto;
    border: auto dotted #ccc;
    margin: 30px auto;
}
h3{
    margin: 10px;
}
p{
    color: red;
}
</style>
