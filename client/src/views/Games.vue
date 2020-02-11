<template>
    <v-tabs :centered="true">
      <v-tab>Tetris</v-tab>
      <v-tab-item >
        <tetris-game-layout class="mt-2"></tetris-game-layout>
      </v-tab-item>
    </v-tabs>
</template>

<script lang="ts">
import Vue from "vue";
import TetrisGameLayout from "@/components/game-layout/Tetris-game-layout.vue";

export default Vue.extend({
  name: "games",
  components: {
    TetrisGameLayout
  }
});
</script>