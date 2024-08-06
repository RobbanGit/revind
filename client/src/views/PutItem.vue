<template>
    <div id="add-item">
        <h2>Edit Item </h2>
        <b-form v-if="!submitted">
            <label>Title:</label>
            <b-input type="text" v-model.lazy="newItem.Title" :placeholder="Item.title" required />
            <label> Description of Item: </label>
            <b-textarea v-model.lazy="newItem.Description" :placeholder="Item.description" required></b-textarea>
            <label>Price:</label>
            <b-input type="text" v-model.lazy="newItem.Price" :placeholder="String(Item.price)" required />
            <label>LocationId :</label>
            <b-input type="text" v-model.lazy="newItem.LocationId" :placeholder="location._id" required />
            <b-col> <b-button v-on:click.prevent="put" id="add-button"> Add Item </b-button> </b-col>
        </b-form>
         <b-col v-if=errorMessage>
           <p>{{detailedErrorMessage}}</p>
            </b-col>
        <b-col v-if="submitted">
            <h5>
            Your Item Has Now Been Edited!
            </h5>
        </b-col>
        <b-col id="preview">
         <h3> Preview</h3>
        <h3> Title : {{newItem.Title}}</h3>
        <h3> Description</h3>
        <h3> {{newItem.Description}} </h3>
        <h3> Price : {{newItem.Price}}</h3>
        <h3> LocationId : {{newItem.LocationId}}</h3>
        </b-col>
    </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      id: this.$route.params.id,
      Item: {},
      location: {},
      newItem: {
        Title: '',
        Description: '',
        Price: '',
        LocationId: ''
      },
      submitted: false,
      errorMessage: false,
      detailedErrorMessage: ''
    }
  },
  created() {
    console.log('page is loaded')
    Api.get('/items/' + this.id).then(response => {
      console.log(response)
      this.Item = response.data
      this.location = this.Item.location
      console.log(this.Item)
      console.log(this.location)
    }).catch(error => {
      this.Item = []
      this.location = []
      this.errorMessage = true
      console.log(error)
      this.detailedErrorMessage = 'Failed to retrieve item'
    })
  },
  methods: {
    put: function () {
      Api.put('/items/' + this.id, {
        title: this.newItem.Title,
        description: this.newItem.Description,
        price: this.newItem.Price,
        location: this.newItem.LocationId
      }).then(response => {
        console.log(response)
        this.submitted = true
      }).catch(error => {
        this.Item = []
        this.newItem = []
        this.errorMessage = true
        console.log(error)
        this.detailedErrorMessage = 'Failed to update item information'
      })
    }
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
input[type="text"],textarea{
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
</style>
