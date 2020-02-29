<template>
  <div class="fur-tetris-home">
    <div class="fur-options-home" v-if="!userWantToPlayTetris">
      <v-btn @click="joinLobbyArea()">Lobby Area</v-btn>
      <v-btn @click="debugLaunchParty()">Debug Launch Party</v-btn>
    </div>
    <fur-tetris-game-layout v-if="userWantToPlayTetris"></fur-tetris-game-layout>
    <!-- DIALOG -->
    <v-dialog v-model="showDialogAskPseudo" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span>Choose a Pseudo</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="pseudo"
            label="Your pseudo"
            required
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn>Close</v-btn>
          <v-btn>Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  pseudo = ""
  userWantJoinLobby = true;
  userWantDebug = false;
  showDialogAskPseudo = false;
  playerChosePSeudo = true;

  get userWantToPlayTetris() {
    return this.playerChosePSeudo && (this.userWantJoinLobby || this.userWantDebug)
  }

  debugLaunchParty() {
    userWantDebug = true
  }

  joinLobbyArea() {
    this.showDialogAskPseudo = true;
    this.userWantPlayTetris = true;
  }

  closeDialog(){
    this.pseudo = "";
    this.showDialogAskPseudo = false;
  }

  enterDialog() {
    this.showDialogAskPseudo = false;
    // TODO: Verif pseudo is filled by player
    this.playerChosePSeudo = true;
  }

}
</script>