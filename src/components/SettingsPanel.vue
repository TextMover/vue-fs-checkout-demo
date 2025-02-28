<template>
  <!-- <div>
    <h2>Settings</h2>
    <form @submit.prevent="saveSettings">
      <div>
        <label for="storefrontId">Storefront ID:</label>
        <input id="storefrontId" v-model="storefrontId" type="text" />
      </div>
      <div>
        <label for="productCatalogPath">Product Catalog Path:</label>
        <input id="productCatalogPath" v-model="productCatalogPath" type="text" />
      </div>
      <button type="submit">Save</button>
    </form>
  </div> -->

  <v-container fluid class="mt-16">
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>Settings</v-card-title>
          <v-card-text>
            <v-form> 
              <v-text-field
                v-model="storefrontId"
                label="Storefront ID"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="productCatalogPath"
                label="Product Catalog Path"
                outlined
              ></v-text-field>
              <v-btn @click="saveSettings">Save</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      storefrontId: localStorage.getItem('storefrontId') || '',
      productCatalogPath: localStorage.getItem('productCatalogPath') || ''
    };
  },
  methods: {
    saveSettings() {
      localStorage.setItem('storefrontId', this.storefrontId);
      localStorage.setItem('productCatalogPath', this.productCatalogPath);
      console.log('storefrontId: ', this.storefrontId);
      console.log('productCatalogPath: ', this.productCatalogPath);
      alert('Settings saved!');
    }
  }
};
</script>
