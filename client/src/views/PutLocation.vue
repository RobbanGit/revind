<template>
    <div id="add-item">
        <h2>Edit Location </h2>
       <b-form v-if="!submitted">
            <label>Name:</label>
            <b-input type="text" v-model.lazy="newLocation.Name" :placeholder="location.name" required />
            <label> Description of Location: </label>
            <b-textarea v-model.lazy="newLocation.Description" :placeholder="location.description" required></b-textarea>
            <label>Country:</label>
            <b-input type="text" v-model.lazy="newLocation.Country" :placeholder="location.country" required />
            <label> City: </label>
            <b-input type="text" v-model.lazy="newLocation.City" :placeholder="location.city" required/>
            <label>Street:</label>
            <b-input type="text" v-model.lazy="newLocation.Street" :placeholder="location.street" required />
            <label>Zipcode:</label>
            <b-input type="text" v-model.lazy="newLocation.Zipcode" :placeholder="String(location.zipcode)" required />
            <b-col> <b-button v-on:click.prevent="put" id="add-button"> Submit New Location </b-button> </b-col>
        </b-form>
         <b-col v-if=errorMessage>
           <p>{{detailedErrorMessage}}</p>
            </b-col>
        <b-col v-if="submitted">
            <h5>
            Your Location Has Now Been Edited!
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
      location: {},
      newLocation: {
        Name: '',
        Description: '',
        Country: '',
        City: '',
        Street: '',
        Zipcode: ''
      },
      submitted: false,
      errorMessage: false,
      detailedErrorMessage: ''
    }
  },
  created() {
    console.log('page is loaded')
    Api.get('/locations/' + this.id).then(response => {
      console.log(response)
      this.location = response.data
      console.log(this.location)
    }).catch(error => {
      this.location = []
      console.log(error)
      this.errorMessage = true
      this.detailedErrorMessage = 'Failed to load location'
    })
  },
  methods: {
    put: function () {
      Api.put('/locations/' + this.id,
        {
          name: this.newLocation.Name,
          description: this.newLocation.Description,
          country: this.newLocation.Country,
          city: this.newLocation.City,
          street: this.newLocation.Street,
          zipcode: this.newLocation.Zipcode
        }
      ).then(response => {
        console.log(response)
        this.submitted = true
      }).catch(error => {
        console.log(error)
        this.errorMessage = true
        this.detailedErrorMessage = 'Failed to update location'
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
