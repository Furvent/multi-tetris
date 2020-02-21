<template>
    <v-tabs :centered="true">
      <v-tab class="fur-link-game"><router-link to="tetris">Tetris</router-link></v-tab>
      <v-tab-item >
        
      </v-tab-item>
    </v-tabs>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "games"
});
</script>

<style scoped>
.fur-link-game a {
  text-decoration: none;
}
</style>