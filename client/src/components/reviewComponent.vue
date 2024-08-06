<template xmlns:b-form-input="http://www.w3.org/1999/html">
  <b-container id="reviewContainer">
    <b-row>
      <b-col><p>Title: {{review.title}}</p></b-col>
      <b-col><p>Description: {{review.description}}</p></b-col>
      <b-col><p>Rating: {{review.rating}}</p></b-col>
      <b-button variant="danger" id="removeReviewButton" size="sm" @click="$emit('del-review', review._id)">Delete</b-button>
      <b-button variant="dark" id="editReviewButton" size="sm" @click="$emit('toggle-review-modal', review._id)">Toggle Edit</b-button>
    </b-row>
    <b-card :id="`reviewCard${review._id}`" style="display: none">
        <b-row>
          <b-col><label>Title: </label></b-col>
          <b-col>
            <b-form-input :id="`reviewTitleField${review._id}`" :value="review.title"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col><label>Description:</label></b-col>
          <b-col>
            <b-form-input :id="`reviewDescriptionField${review._id}`" :value="review.description"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col><label>Rating: </label></b-col>
          <b-col><b-form-input :id="`reviewRatingField${review._id}`" :value="review.rating"/>
          </b-col>
        </b-row>
      <b-row>
        <b-col>
          <b-button id="updateInfoButton" variant="dark" @click="$emit('update-review-info', review._id)">Update Info</b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'review-item',
  props: ['review']
}

</script>

<style>
#reviewContainer {
  margin-bottom: 1em;
}

#removeReviewButton {
  margin: 0.5em;
}

#editReviewButton {
  margin: 0.5em;
}

</style>
