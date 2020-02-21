<template>
  <div class="fur-tetris-home">
    <div class="fur-options-home" v-if="!userWantPlayTetris">
      <v-btn @click="joinLobbyArea()">Lobby Area</v-btn>
      <v-btn @click="debugLaunchParty()">Debug Launch Party</v-btn>
    </div>
    <fur-tetris-game-layout v-if="userWantPlayTetris"></fur-tetris-game-layout>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

import FurTetrisGameLayout from "@/components/game-layout/tetris/components/fur-tetris-game-layout";
@Component({
  name: "fur-tetris",
  components: {
    FurTetrisGameLayout
  }
})
export default class extends Vue {
  userWantPlayTetris = false;
}
</script>