<template>
  <v-card>
    <v-card-title primary-title>{{ lobbyTitle }}</v-card-title>
    <v-card-text>
      <div v-for="player in lobbyPlayers" :key="player.name">
        <v-container>
          <v-row align="center">
            <v-col cols="8">
              <p>{{ player.name }}</p>
            </v-col>
            <v-col cols="4">
              <p :class="getPlayerAvailabilityCSSClass(player)">{{ getPlayerAvailability(player) }}</p>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-container>
        <v-row align="center">
          <!-- <v-col cols="4">

          </v-col>
          <v-col cols="4">

          </v-col> -->
          <v-btn>
            bob
          </v-btn>
          <v-btn>
            bob2
          </v-btn>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { PayloadLobbyPlayer } from "../../../../../../share/types/PayloadLobbyPlayer";

@Component({
  name: "tetris-private-lobby"
})
export default class extends Vue {

  get lobbyTitle() {
    return this.$store.getters.getPrivateLobby.name;
  }

  get lobbyPlayers() {
    return this.$store.getters.getPrivateLobby.players;
  }

  getPlayerAvailabilityCSSClass(player: PayloadLobbyPlayer) {
    return {
      red: !player.isReady,
      green: player.isReady
    };
  }

  getPlayerAvailability(player: PayloadLobbyPlayer) {
    return player.isReady ? "ready" : "not ready";
  }
}
</script>