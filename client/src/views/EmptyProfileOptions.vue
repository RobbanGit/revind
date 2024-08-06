<template>
  <b-container>
    <b-row>
  <p>Redirecting you to your profile options...</p>
    </b-row>
    <b-row>
  <p>{{errorMessage}}</p>
    </b-row>
  </b-container>
</template>

<script>

export default {
  mounted() {
    try {
      if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
        const userid = window.document.cookie.split('=')[1]
        if (userid !== '') {
          console.log(userid)
          window.location = `/profile-options/${userid}`
        } else {
          window.location = '/'
        }
      } else {
        window.location = '/'
      }
    } catch (error) {
      this.errorMessage = 'Failed to retrieve user information'
    }
  },
  data() {
    return {
      errorMessage: null
    }
  }
}

</script>
