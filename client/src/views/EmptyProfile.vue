<template>
  <h1>{{this.infoMessage}}</h1>
</template>

<script>

export default {
  mounted() {
    // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
    if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
      const userid = window.document.cookie.split('=')[1]
      console.log(`userId cookie:${userid}`)
      if (userid !== '') {
        if (userid !== null) { // sends a user to their profile, if a cookie exists with their id
          window.location = `/profile/${userid}`
        }
      }
    } else {
      console.log('No userId cookie exists')
      this.infoMessage = 'You are not logged in. Please log in and try again.'
      setTimeout(() => { // returns user back to the homepage, if not logged in.
        window.location = '/'
      }, 5000)
    }
  },
  data() {
    return {
      infoMessage: 'Redirecting you to your profile'
    }
  }
}

</script>
