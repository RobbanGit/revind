<template>
  <b-container id="itemListContainer">
    <b-row><b-col><h1>item List:</h1></b-col></b-row>
    <b-row>
      <b-col>
        <b-button variant="danger" id="removeAllItemsButton" @click="deleteAllItems">Delete All Items</b-button>
      </b-col>
    </b-row>
    <b-row class="col-11" v-for="item in items" :key="item._id">
      <b-col>
        <item-component v-bind:item="item" v-on:del-item="deleteUser" v-on:show-item-modal="showItemModal" v-on:update-item-info="updateItemInfo"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Api } from '../Api'
import ItemComponent from './itemComponent'

export default {
  components: { 'item-component': ItemComponent },
  mounted() {
    this.loadItems()
  },
  data() {
    return {
      items: []
    }
  },
  methods: {
    loadItems() {
      Api.get('/items/').then(resp => {
        this.items = resp.data.items
      }).catch(() => {
        this.errorMessage = 'Something went wrong when importing items'
      })
    },
    deleteUser(itemId) {
      console.log(itemId)
      Api.delete(`/items/${itemId}`).then(resp => {
        const itemIndex = this.items.findIndex(item => item._id === itemId)
        this.items.splice(itemIndex, 1)
        this.errorMessage = 'Successfully deleted item!'
        setTimeout(() => {
          this.errorMessage = ''
        }, 5000)
      }).catch(() => {
        this.errorMessage = `Could not delete item with id: ${this.item._id}`
      })
    },
    deleteAllItems() {
      console.log('Deleting all items') // Clear array content reactive src: https://stackoverflow.com/questions/57834381/vue-js-clearing-an-array-content-and-reactivity-issues
      Api.delete('/items/').then(() => {
        this.items.splice(0)
        console.log('All items deleted!')
      }).catch(() => {
        this.errorMessage = 'Could not delete all items!'
      })
    },
    showItemModal(itemId) {
      try {
        const itemModalVar = document.getElementById(`itemCard${itemId}`)
        if (itemModalVar.style.display === 'block') {
          itemModalVar.style.display = 'none'
        } else {
          itemModalVar.style.display = 'block'
        }
      } catch (error) {
        this.errorMessage = 'Failed to access item element'
      }
    },
    updateItemInfo(itemId) {
      try {
        const itemTitleVar = document.getElementById(`itemTitleField${itemId}`).value
        const itemDescriptionVar = document.getElementById(`itemDescriptionField${itemId}`).value
        const itemPriceVar = document.getElementById(`itemPriceField${itemId}`).value

        Api.patch(`/items/${itemId}`, {
          title: itemTitleVar,
          description: itemDescriptionVar,
          price: itemPriceVar
        }).then(() => {
          setTimeout(() => {
            this.statusMessage = 'Successfully updated item!'
            this.statusMessage.style.display = 'block'
          }, 5000)
          this.statusMessage = ''
          this.statusMessage.style.display = 'none'
        }).catch(() => {
          this.errorMessage = `Could not update item with id: ${itemId}`
        })
      } catch (error) {
        this.errorMessage = 'Failed to access item elements'
      }
    }
  }
}

</script>
