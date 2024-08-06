<template>
  <b-container id="suggestionListContainer">
    <b-row><b-col><h1>suggestion List:</h1></b-col></b-row>
    <b-row>
      <b-col>
        <b-button variant="danger" id="removeAllSuggestionsButton" @click="deleteAllSuggestions">Delete All Suggestions</b-button>
      </b-col>
    </b-row>
    <b-row class="col-11" v-for="suggestion in suggestions" :key="suggestion._id">
      <b-col>
        <suggestion-component v-bind:suggestion="suggestion" v-on:del-suggestion="deleteSuggestion"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Api } from '../Api'
import SuggestionComponent from './suggestionComponent'

export default {
  components: { 'suggestion-component': SuggestionComponent },
  mounted() {
    this.loadSuggestions()
  },
  data() {
    return {
      suggestions: []
    }
  },
  methods: {
    loadSuggestions() {
      Api.get('/suggestions/').then(resp => {
        this.suggestions = resp.data
      }).catch(() => {
        this.errorMessage = 'Something went wrong when importing suggestions'
      })
    },
    deleteSuggestion(suggestionId) {
      console.log(suggestionId)
      Api.delete(`/suggestions/${suggestionId}`).then(resp => {
        const suggestionIndex = this.suggestions.findIndex(suggestion => suggestion._id === suggestionId)
        this.suggestions.splice(suggestionIndex, 1)
        this.errorMessage = 'Successfully deleted suggestion!'
        setTimeout(() => {
          this.errorMessage = ''
        }, 5000)
      }).catch(() => {
        this.errorMessage = `Could not delete suggestion with id: ${this.suggestions._id}`
      })
    },
    deleteAllSuggestions() {
      console.log('Deleting all Suggestions') // Clear array content reactive src: https://stackoverflow.com/questions/57834381/vue-js-clearing-an-array-content-and-reactivity-issues
      Api.delete('/suggestions/').then(() => {
        this.suggestions.splice(0)
        console.log('All suggestions deleted!')
      }).catch(() => {
        this.errorMessage = 'could not delete all suggestions!'
      })
    }
  }
}

</script>
