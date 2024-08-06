<template>
  <b-container id="suggestionContainer">
    <b-row>
      <b-col><p>User's Username: {{suggestion.username}}</p></b-col>
      <b-col><p>User's Email: {{suggestion.email}}</p></b-col>
      <b-col><p>Subject: {{suggestion.subject}}</p></b-col>
      <b-col><p>Feedback: {{suggestion.feedback}}</p></b-col>
      <b-button variant="danger" id="removeSuggestionButton" @click="$emit('del-suggestion', suggestion._id)">Delete</b-button>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'suggestion-item',
  props: ['suggestion']
}

</script>

<style>
#suggestionContainer {
  margin-bottom: 1em;
}

#removeSuggestionButton {
  margin: 0.5em;
}

</style>
