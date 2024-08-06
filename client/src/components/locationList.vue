<template>
  <b-container id="locationListContainer">
    <b-row><b-col><h1>Location List:</h1></b-col></b-row>
    <b-row>
      <b-col>
        <b-button variant="danger" id="removeAllLocationsButton" @click="deleteAllLocations">Delete All Locations</b-button>
      </b-col>
    </b-row>
    <b-row class="col-11" v-for="location in locations" :key="location._id">
      <b-col>
        <location-component v-bind:location="location" v-on:del-location="deleteLocation" v-on:toggle-location-modal="showModalWindow" v-on:update-location-info="updateLocationInfo"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Api } from '../Api'
import LocationComponent from './locationComponent'

export default {
  components: { 'location-component': LocationComponent },
  mounted() {
    this.loadLocations()
  },
  data() {
    return {
      locations: []
    }
  },
  methods: {
    loadLocations() {
      Api.get('/locations/').then(resp => {
        this.locations = resp.data.locations
      }).catch(() => {
        this.errorMessage = 'Something went wrong when importing locations'
      })
    },
    deleteLocation(locationId) {
      console.log(locationId)
      Api.delete(`/locations/${locationId}`).then(resp => {
        const locationIndex = this.locations.findIndex(item => item._id === locationId)
        this.locations.splice(locationIndex, 1)
        this.errorMessage = 'Successfully deleted location!'
        setTimeout(() => {
          this.errorMessage = ''
        }, 5000)
      }).catch(() => {
        this.errorMessage = `Could not delete location with id: ${this.location._id}`
      })
    },
    deleteAllLocations() {
      console.log('Deleting all locations') // Clear array content reactive src: https://stackoverflow.com/questions/57834381/vue-js-clearing-an-array-content-and-reactivity-issues
      Api.delete('/locations/').then(() => {
        this.locations.splice(0)
        console.log('All locations deleted!')
      }).catch(() => {
        this.errorMessage = 'Could not delete all locations!'
      })
    },
    showModalWindow(locationId) {
      try {
        const locationModalVar = document.getElementById(`locationCard${locationId}`)
        if (locationModalVar.style.display === 'block') {
          locationModalVar.style.display = 'none'
        } else {
          locationModalVar.style.display = 'block'
        }
      } catch (error) {
        this.errorMessage = 'Failed to access location element'
      }
    },
    updateLocationInfo(locationId) {
      try {
        const locationNameValue = document.getElementById(`locationNameField${locationId}`).value
        const locationDescriptionValue = document.getElementById(`locationDescriptionField${locationId}`).value
        const locationCountryValue = document.getElementById(`locationCountryField${locationId}`).value
        const locationCityValue = document.getElementById(`locationCityField${locationId}`).value
        const locationStreetValue = document.getElementById(`locationStreetField${locationId}`).value
        const locationZipcodeValue = document.getElementById(`locationZipcodeField${locationId}`).value

        Api.put(`/locations/${locationId}`, {
          name: locationNameValue,
          description: locationDescriptionValue,
          country: locationCountryValue,
          city: locationCityValue,
          street: locationStreetValue,
          zipcode: locationZipcodeValue
        }).then(() => {
          console.log(`location with id: ${locationId} has been updated!`)
        }
        )
      } catch (err) {
        console.log(err)
        this.errorMessage = `Could not delete location with id: ${locationId}`
      }
    }
  }
}

</script>
