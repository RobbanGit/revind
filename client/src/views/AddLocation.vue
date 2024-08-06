<template>
    <div id="add-item">
        <h2>Add a New Location </h2>
        <b-form v-if="!submitted">
            <label>Name:</label>
            <b-input type="text" v-model.lazy="newLocation.Name" required />
            <label> Description of Location: </label>
            <b-textarea v-model.lazy="newLocation.Description" required></b-textarea>
            <br>
            <label>Country:</label>
            <b-input type="text" v-model.lazy="newLocation.Country" required />
            <label> City: </label>
            <b-input type="text" v-model.lazy="newLocation.City" required/>
            <label>Street:</label>
            <b-input type="text" v-model.lazy="newLocation.Street" required />
            <label>Zipcode:</label>
            <b-input type="text" v-model.lazy="newLocation.Zipcode" required />
            <b-row> <b-button v-on:click.prevent="post" id="add-button"> Add Location </b-button> </b-row>
            <b-col v-if=errorMessage>
              <p>{{detailedErrorMessage}}</p>
            </b-col>
        </b-form>
        <b-col v-if="submitted">
            <h5>
            Your Location Has Now Been Added!
            </h5>
        </b-col>
        <b-col id="preview">
         <h3> Preview</h3>
        <h3> Name : {{newLocation.Name}}</h3>
        <h3> Description</h3>
        <h3> {{newLocation.Description}} </h3>
        <h3> Country : {{newLocation.Country}}</h3>
        <h3> City : {{newLocation.City}}</h3>
        <h3> Street : {{newLocation.Street}}</h3>
        <h3> Zipcode : {{newLocation.Zipcode}}</h3>
        </b-col>
    </div>
</template>
<script>
import { Api } from '@/Api'
export default {
  data() {
    return {
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
  methods: {
    post: function () {
      Api.post('/locations',
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
        this.newItem = []
        this.errorMessage = true
        console.log(error)
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
p{
    color: red;
}
</style>
