<template>
  <div>
    <h1>Here you can post</h1>
    <h2 id="suggestions">{{header}} the</h2>
    <h2 id="applicationText">application</h2>
    <h3 id="confirmed" :style="{background: successColor}">{{ confirmation }}</h3>
    <b-form class="col-sm-8 col-md-10 col-lg-6" @submit="onSubmit">
        <b-form-group id="input-group-username" label="Username" label-for="input-username"><span style="color:red">*</span>
          <b-form-input id="input-username" v-model="form[0].username" maxlength="16" required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-email" label="email" label-for="input-email"><span style="color:red">*</span>
          <b-form-input id="input-email" v-model="form[0].email" type="email" placeholder="YourEmail@email.com" required></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-subject" label="subject" label-for="input-subject"><span style="color:red">*</span>
          <b-form-select id="input-subject" v-model="form[0].subject" :options="subjects" required></b-form-select>
        </b-form-group>
        <b-form-group id="input-group-feedback" label="feedback" label-for="input-feedback" description="max 3500 characters"><span style="color:red">*</span>
          <b-form-textarea id="input-feedback" v-model="form[0].feedback" placeholder="Your feedback here..." rows="6" @keyup="countChars()" required></b-form-textarea>
          <b-progress class="mt-2" :max="charOverload.maxCount" height="2.5em">
            <b-progress-bar :value="charOverload.characterCount" :variant="charOverload.variant">
              <span>{{ charOverload.characterCount }} / {{ charOverload.maxCount }}</span>
            </b-progress-bar>
          </b-progress>
        </b-form-group>
         <b-button block variant="secondary" :pressed.sync="preview" @click="setUserIdToForm">Preview</b-button>
         <b-button id="submitButton" block type="submit" variant="success">Submit</b-button>
    </b-form>
    <div id="preview" v-show="preview">
      <b-card class="mt-1" header="Preview of your form">
        <b-table stacked :items="form"></b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
const headerList = ['Suggestions for', 'Feedback for', 'Ideas for', 'Issues with', 'Problems with']
let i = 0

export default {
  data() {
    return {
      header: '',
      currentUser: {
        _id: ''
      },
      form: [{
        userId: '',
        username: '',
        email: '',
        subject: null,
        feedback: ''
      }],
      preview: false,
      charOverload: {
        characterCount: 0,
        maxCount: 3500,
        variant: 'success'
      },
      subjects: [{ text: 'Choose a Subject', value: null }, 'Profile page', 'Location view', 'Item page', 'Review feature', 'Other'],
      show: true,
      confirmation: null,
      successColor: 'lightgreen'
    }
  },
  computed: {
    counterOverload() {
      return this.charOverload.countColor
    }
  },
  methods: {
    async onSubmit(event) {
      console.log(this.form)
      if (this.form[0].feedback.length < 3501) {
        event.preventDefault()
        const postSuccess = await this.postSuggestion()
        if (postSuccess) {
          this.onReset(event)
          this.successColor = 'lightgreen'
        } else {
          this.successColor = 'rgb(233, 96, 96)'
        }
      }
    },
    onReset(event) {
      event.preventDefault()
      this.form[0].username = ''
      this.form[0].email = ''
      this.form[0].subject = null
      this.form[0].feedback = ''
      this.charOverload.characterCount = 0
      this.charOverload.variant = 'success'
      setTimeout(this.resetConfirmation, 5000)
    },
    resetConfirmation() {
      this.confirmation = null
    },
    updateHeader() {
      this.header = headerList[i]
      i++
      if (i === headerList.length) {
        i = 0
      }
    },
    async postSuggestion() {
      try {
        const suggestionData = await Api.post('/suggestions', this.form)
        console.log(suggestionData)
        this.confirmation = suggestionData
        const statusCode = suggestionData.status
        if (statusCode === 201) {
          this.confirmation = 'Successfully submitted!'
          return true
        }
      } catch (error) {
        this.confirmation = 'Something went wrong! Couldn\'t submit form'
        return false
      }
    },
    countChars() {
      try {
        this.charOverload.characterCount = this.form[0].feedback.length
        const charCount = this.charOverload.characterCount
        if (charCount > 3000 && charCount < 3501) {
          this.charOverload.variant = 'warning'
        } else if (charCount > 3500) {
          this.charOverload.variant = 'danger'
        } else {
          this.charOverload.variant = 'success'
        }
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Failed to count characters'
      }
    },
    async getUserData() {
      try {
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            const userInfo = await Api.get('/login/extractSessionId')
            console.log(userInfo.data._id)
            this.currentUser._id = userInfo.data._id
            this.setUserIdToForm()
          }
        }
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Failed to retrieve user information'
      }
    },
    async setUserIdToForm() {
      try {
        this.form[0].userId = this.currentUser._id
        const id = await localStorage.getItem('userId')
        console.log(id)
      } catch (error) {
        this.variant = 'danger'
        this.confirmation = 'Failed to assign user to suggestion'
      }
    }
  },
  mounted: function () {
    this.getUserData()
    this.updateHeader()
    setInterval(this.updateHeader, 5000)
  }
}
</script>

<style>
    form {
        margin: 30px auto;
        background: white;
        border-radius: 10px;
        text-align: left;
        padding: 2em;
    }
    label {
        color: #aaa;
        display: inline-block;
        margin: 25px 0 15px;
        font-size: 1em;
        text-transform: uppercase;
        letter-spacing: 0.5em;
    }
    #confirmed {
        background-color: lightgreen;
    }
    .input-group-username {
        font-size: 3;
    }
</style>
