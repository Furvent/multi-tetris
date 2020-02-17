<template>
  <v-card>
    <v-card-title primary-title> Welcome in lobby: {{ lobbyTitle }}</v-card-title>
    <v-card-text>
      <div v-for="player in lobbyPlayers" :key="player.pseudo">
        <v-container>
          <v-row align="center">
            <v-col cols="8">
              <p>{{ player.pseudo }}</p>
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
        <v-row align="center" justify="center">
          <v-col cols="4">
            <v-btn>Left Lobby</v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn @click.prevent="changeAvailabilityStatus()">{{ readyCheckText }}</v-btn>
          </v-col>
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
import { emitChangePlayerAvailabilityInPrivateLobby } from "../../socket/lobby-events";

@Component({
  name: "tetris-private-lobby"
})
export default class extends Vue {
  isReady: boolean = false;

  get lobbyTitle() {
    return this.$store.getters.getPrivateLobby.name;
  }

  get lobbyPlayers() {
    return this.$store.getters.getPrivateLobby.players;
  }

  get readyCheckText() {
    return this.isReady ? "Remove ready status" : "Ready ?";
  }

  getPlayerSocket() {
    return this.$store.getters.getPlayerSocket;
  }

  getPrivateLobbyId() {
    return this.$store.getters.getPrivateLobby.id;
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

  changeAvailabilityStatus() {
    this.isReady = !this.isReady;
    emitChangePlayerAvailabilityInPrivateLobby(this.getPlayerSocket(), {
      availability: this.isReady,
      lobbyId: this.getPrivateLobbyId()
    });
  }
}
</script>