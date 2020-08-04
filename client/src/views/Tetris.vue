<template>
  <div class="fur-tetris-home">
    <div class="fur-options-home" v-if="showOptionsToPlayer">
      <v-btn @click="joinLobbyArea()">Lobby Area</v-btn>
      <v-btn @click="debugLaunchParty()">Debug Launch Party</v-btn>
    </div>
    <fur-tetris-game-layout v-if="showTetrisComponentToPlayer" :play-solo="userWantDebug"></fur-tetris-game-layout>
    
    <!-- DIALOG -->
    <v-dialog v-model="showDialogAskPseudo" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span>Choose a Pseudo</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="pseudo" label="Your pseudo" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="enterDialog()" :disabled="pseudo === ''">PLAY</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

import FurTetrisGameLayout from "@/components/game-layouts/tetris/components/fur-tetris-game-layout";

@Component({
  name: "fur-tetris",
  components: {
    FurTetrisGameLayout
  }
})
export default class extends Vue {
  pseudo = "";

  userWantJoinLobby = false;
  userWantDebug = false;

  showDialogAskPseudo = true;

  get showOptionsToPlayer() {
    return !(this.userWantJoinLobby || this.userWantDebug);
  }

  get showTetrisComponentToPlayer() {
    return this.userWantJoinLobby | this.userWantDebug;
  }

  mounted() {
    this.pseudo = this.getPseudo();
    if (this.pseudo !== "") {
      this.showDialogAskPseudo = false;
    }
  }

  joinLobbyArea() {
    this.userWantJoinLobby = true;
  }
  
  debugLaunchParty() {
    
    userWantDebug = true;
  }

  closeDialog() {
    this.pseudo = "";
    this.showDialogAskPseudo = false;
  }

  enterDialog() {
    this.$store.commit("setOwnPseudo", this.pseudo);
    this.showDialogAskPseudo = false;
  }

  getPseudo() {
    return this.$store.getters.getOwnPseudo;
  }
}
</script>