<template>
  <b-container id="locationContainer">
    <b-row>
      <b-col><p>Name: {{location.name}}</p></b-col>
      <b-col><p>country: {{location.country}}</p></b-col>
      <b-col><p>city: {{location.city}}</p></b-col>
      <b-col><p>street: {{location.street}}</p></b-col>
      <b-col><p>zipcode: {{location.zipcode}}</p></b-col>
      <b-button variant="danger" id="removeLocationButton" @click="$emit('del-location', location._id)">Delete</b-button>
      <b-button variant="dark" id="editLocationButton" size="sm" @click="$emit('toggle-location-modal', location._id)">Toggle Edit</b-button>
    </b-row>
    <b-card :id="`locationCard${location._id}`" style="display: none">
      <b-row>
        <b-col><label>Name: </label></b-col>
        <b-col>
          <b-form-input :id="`locationNameField${location._id}`" :value="location.name"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col><label>Description: </label></b-col>
        <b-col>
          <b-form-textarea :id="`locationDescriptionField${location._id}`" :value="location.description"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col><label>Country: </label></b-col>
        <b-col>
          <b-form-input :id="`locationCountryField${location._id}`" :value="location.country"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col><label>City: </label></b-col>
        <b-col>
          <b-form-input :id="`locationCityField${location._id}`" :value="location.city"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col><label>Street</label></b-col>
        <b-col>
          <b-form-input :id="`locationStreetField${location._id}`" :value="location.street"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col><label>Zipcode: </label></b-col>
        <b-col>
          <b-form-input :id="`locationZipcodeField${location._id}`" :value="location.zipcode"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-button id="updateLocationButton" @click="$emit('update-location-info', location._id)">Update Info</b-button>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'location-item',
  props: ['location']
}

</script>

<style>
#locationContainer {
  margin-bottom: 1em;
}

#removeLocationButton {
  margin: 0.5em;
}

</style>
