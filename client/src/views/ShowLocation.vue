<template>
    <div id="more-ifo">
      <b-col v-if="!errorMessage">
      <b-col class="hdivider" ></b-col>
      <h3>{{location.name}} </h3>
        <b-col class="vdivider" ></b-col>
        <article>  {{location.description}}</article>
        <b-col class="vdivider" ></b-col>
        <b-col> Country: {{location.country}}</b-col>
        <b-col> City: {{location.city}}</b-col>
        <b-col> Street: {{location.street}}</b-col>
        <b-col> Zipcode: {{location.zipcode}}</b-col>
        <b-col class="hdivider" ></b-col>

         </b-col>
         <b-col class="vdivider" ></b-col>
         <h3>Items in this location: </h3>
           <b-col v-for="item in items" v-bind:key="item._id">
             <b-col>
               <b-card id="item">
               <b-card-title>
                   {{item.title}}
                   </b-card-title>
                    <b-card-text>
                   {{item.description}}
                    </b-card-text>
                   <b-card-text>
                 Price : {{item.price}}
                  </b-card-text>
                  </b-card>
               </b-col>
           </b-col>
         <b-col v-if="errorMessage">
           <h3>
             {{detailedErrorMessage}}
           </h3>
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
      items: {},
      errorMessage: false,
      detailedErrorMessage: ''
    }
  },
  mounted() {
    console.log('page is loaded')
    Api.get('/locations/' + this.id).then(response => {
      this.location = response.data
    }).catch(error => {
      this.location = []
      this.errorMessage = true
      this.detailedErrorMessage = 'Failed to load location'
      console.log(error)
    })
    Api.get('/locations/' + this.id + '/items/').then(response => {
      this.items = response.data
      console.log(this.items)
    }).catch(error => {
      this.location = []
      this.errorMessage = true
      this.detailedErrorMessage = 'Failed to load products'
      console.log(error)
    })
  }
}
</script>
<style  scoped>
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
#item{
      margin: 20px auto;
}
#error{
  color: red;
}
</style>
