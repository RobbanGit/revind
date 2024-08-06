<template>
  <b-container id="userContainer">
    <b-row>
      <b-col><p>Email: {{user.email}}</p></b-col>
      <b-col><p>Username: {{user.username}}</p></b-col>
      <b-col><p>Password: {{user.password}}</p></b-col>
      <b-col><p>UserType: {{user.userType}}</p></b-col>
      <b-button variant="danger" id="removeUserButton" size="sm" @click="$emit('del-user', user._id)">Delete</b-button>
      <b-button id="editUserButton" variant="dark" size="sm" @click="$emit('show-user-modal', user._id)">Toggle Edit</b-button>
    </b-row>
    <b-card :id="`userModal${user._id}`" style="display: none">
    <b-row>
      <label id="userModalEmailLabel">Email: </label>
      <b-form-input :id="`emailField${user._id}`" :value="user.email"></b-form-input>
    </b-row>
    <b-row>
      <label id="userModalUsernameLabel">Username: </label>
      <b-form-input :id="`usernameField${user._id}`" :value="user.username"></b-form-input>
    </b-row>
    <b-row>
      <label id="userModalPasswordLabel">Password: </label>
      <b-form-input :id="`passwordField${user._id}`" :value="user.password"></b-form-input>
    </b-row>
      <b-row>
        <b-col>
          <b-button id="updateInfoButton" variant="dark" @click="$emit('update-user-info', user._id)">Update Info</b-button>
        </b-col>
          <b-col>
            <b-button id="changeUserTypeButton" variant="dark" @click="$emit('change-user-type', user)">Change User Type</b-button>
          </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'user-item',
  props: ['user']
}

</script>

<style>
#userContainer {
  margin-bottom: 1em;
}

#removeUserButton {
  margin: 0.5em;
}

#updateInfoButton {
  margin: 0.5em;
}

#changeUserTypeButton {
  margin: 0.5em;
}

#editUserButton {
  margin: 0.5em;
}

</style>
