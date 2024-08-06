<template>
  <div :style="{background: mode}">
    <div style="background-color:#c6eec5">
      <b-img :src="require('../assets/HomePageBanner.png')" rounded alt="Rounded image" fluid></b-img>
    </div>
    <b-tabs content-class="mt-3" active-nav-item-class="font-weight-bold text-success" justified lazy>
      <b-tab title="Welcome" active>
        <h1>Welcome to Revind</h1>
        <h3 class="d-none d-md-block">Find ratings of local locations and items with our service</h3>
        <b-nav-form v-if="this.currentUser._id !== null">
          <!-- IF LOGGED IN -->
          <b-form-input size="md" class="mr-sm-2" placeholder="Search for locations"></b-form-input>
          <b-button size="md" class="my-2 my-sm-0" variant="success" @click="$router.push('/locations')">Search</b-button>
        </b-nav-form>
        <b-container fluid="md" v-else>
          <!-- IF NOT LOGGED IN-->
          <b-row fluid>
            <b-col class="col-lg-2 d-none d-lg-block"></b-col>
            <b-card class="col-md-5 col-lg-3 border-0 pl-2">
              <b-card-text>New to Revind?</b-card-text>
                <b-col>
                  <b-button variant="success" size="lg" @click="redirReg()">Sign Up</b-button>
                </b-col>
            </b-card>
            <!--Thing dividing in the middle -->
            <b-col class="col-md-1 d-sm-none d-md-block"></b-col>
            <b-col class="col-md-1 border-left d-sm-none d-md-block"></b-col>
            <!-- -->
            <b-card class="col-md-5 col-lg-3 border-0 pl-2">
              <hr class="d-sm-block d-md-none">
              <b-card-text align-self="center">Used Revind before?</b-card-text>
              <b-col>
                <b-button variant="success" size="lg" @click="redirLogIn()">Log In</b-button>
              </b-col>
            </b-card>
            <b-col class="col-lg-2 d-none d-lg-block"></b-col>
          </b-row>
        </b-container>
      </b-tab>
      <b-tab title="About">
        <h1>About Revind</h1>
        <h3>Introduction</h3>
        <p>Revind is a system created for people to rate and review different locations or items they come across.<br>
        Revind is an app where people from all corners of the world can leave their opinions and ideas on all sorts of things.<br>
        A restaurant they liked, a product that changed their life or an experience they would never like to relive.<br>
        Here people can get a feel and understanding for items they wish to buy, places they want visit and so on. <br>
        Revind will give people a sense of confidence in what to expect and all the different types of experiences to look forward to. <br>
        We belive gathering all reviews of products and locations in one place makes travelling easier </p>
      </b-tab>
      <b-tab title="Contact">
        <h1>Contact info</h1>
        <h2>Developers</h2>
        <b-card class="border-0">
          <b-table striped hover :items="devs" stacked="sm" responsive="md" :sort-by.sync="sort"></b-table>
        </b-card>
        <p></p>
      </b-tab>
      <b-tab title="Other"><p>Here you can find other things</p></b-tab>
    </b-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  mounted() {
    this.getUserData()
  },
  data() {
    return {
      bannerPics: [],
      mode: 'light',
      currentUser: {
        _id: null,
        email: '',
        username: '',
        userType: ''
      },
      show: false,
      message: 'none',
      sort: 'lastname',
      devs: [
        {
          firstname: 'Simon',
          lastname: 'Arvidsson',
          email: 'gussimoar@student.gu.se'
        },
        {
          firstname: 'Asiya',
          lastname: 'Ismail Mohamed',
          email: 'gusasiymo@student.gu.se'
        },
        {
          firstname: 'Robin',
          lastname: 'Hansen',
          email: 'gushanrod@student.gu.se'
        }
      ]
    }
  },
  methods: {
    async getUserData() {
      try {
        // regex(cred: hegemon): https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        if (document.cookie.match(/^(.*;)?\s*userId\s*=\s*[^;]+(.*)?$/)) {
          const userid = window.document.cookie.split('=')[1]
          if (userid !== '') {
            const userInfo = await Api.get(`/users/${userid}`)
            console.log(userInfo.data)
            this.currentUser._id = userInfo.data._id
            this.currentUser.email = userInfo.data._id
            this.currentUser.username = userInfo.data._id
            this.currentUser.userType = userInfo.data._id
          }
        }
      } catch (error) {
        console.log('Failed to retrieve user information')
      }
    },
    redirReg() {
      window.location = '/register'
    },
    redirLogIn() {
      window.location = '/login'
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
body{
  margin: 0;

}
</style>
