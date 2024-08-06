<template>
    <div id="add-item">
        <h2>Edit Details of Item </h2>
        <b-form v-if="!submitted">
            <label>Title:</label>
            <b-input type="text" v-model.lazy="newItem.Title" :placeholder="Item.title" required />
            <label> Description of Item: </label>
            <b-textarea v-model.lazy="newItem.Description" :placeholder="Item.description" required></b-textarea>
            <label>Price:</label>
            <b-input type="number" v-model.lazy="newItem.Price" :placeholder="String(Item.price)" required />
            <label>LocationId :</label>
            <b-input type="text" v-model.lazy="newItem.LocationId" :placeholder="location._id" required />
            <b-col> <b-button v-on:click.prevent="patch" id="add-button"> Submit </b-button> </b-col>
        </b-form>
         <b-col v-if=errorMessage>
           <p>{{detailedErrorMessage}}</p>
            </b-col>
        <b-col v-if="submitted">
            <h5>
            Your Item Has Now Been Edited!
            </h5>
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
      this.detailedErrorMessage = 'Failed to retrieve items'
    })
  },
  methods: {
    patch: function () {
      Api.patch('/items/' + this.id, {
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
        this.detailedErrorMessage = 'Failed to patch item'
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
</style>
