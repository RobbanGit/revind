<template>
  <b-container id="itemContainer">
    <b-row>
      <b-col><p>title: {{item.title}}</p></b-col>
      <b-col><p>description: {{item.description}}</p></b-col>
      <b-col><p>price: {{item.price}}</p></b-col>
      <b-col>
        <b-button variant="danger" id="removeItemButton" size="sm" @click="$emit('del-item', item._id)">Delete</b-button>
      </b-col>
      <b-col>
        <b-button variant="dark" id="editItemButton" size="sm" @click="$emit('show-item-modal', item._id)">Toggle Edit</b-button>
      </b-col>
    </b-row>
    <b-card :id="`itemCard${item._id}`" style="display: none">
      <b-row>
        <label id="itemTitleLabel">Title: </label>
        <b-form-input :id="`itemTitleField${item._id}`" :value="item.title"></b-form-input>
      </b-row>
      <b-row>
        <label id="itemDescriptionLabel">Description: </label>
        <b-form-input :id="`itemDescriptionField${item._id}`" :value="item.description"></b-form-input>
      </b-row>
      <b-row>
        <label id="itemPriceLabel">Price: </label>
        <b-form-input :id="`itemPriceField${item._id}`" :value="item.price"></b-form-input>
      </b-row>
      <b-row>
        <b-col>
          <b-button id="updateInfoButton" variant="dark" @click="$emit('update-item-info', item._id)">Update Info</b-button>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'item-item',
  props: ['item']
}

</script>

<style>
#itemContainer {
  margin-bottom: 1em;
}

#removeItemButton {
  margin: 0.5em;
}

#editItemButton {
  margin: 0.5em;
}

#updateInfoButton {
  margin: 0.5em;
}

</style>
