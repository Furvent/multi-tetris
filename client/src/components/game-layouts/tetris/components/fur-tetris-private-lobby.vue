<template>
  <v-card>
    <v-card-title primary-title>Welcome in lobby: {{ lobbyTitle }}</v-card-title>
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
            <v-btn @click.prevent="leavePrivateLobby()">Left Lobby</v-btn>
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
import { PayloadLobbyUser } from "../../../../../../share/types/PayloadLobbyUser";
import {
  emitChangeLobbyUserAvailabilityInPrivateLobby,
  emitLeavePrivateLobby
} from "../../socket/lobbyEvents";

@Component({
  name: "tetris-private-lobby"
})
export default class extends Vue {
  isReady: boolean = false;

  get lobbyTitle() {
    return this.$store.getters.getPrivateLobby.name;
  }

  get lobbyPlayers() {
    return this.$store.getters.getPrivateLobby.lobbyUsers;
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

  getPlayerAvailabilityCSSClass(player: PayloadLobbyUser) {
    return {
      red: !player.isReady,
      green: player.isReady
    };
  }

  getPlayerAvailability(player: PayloadLobbyUser) {
    return player.isReady ? "ready" : "not ready";
  }

  changeAvailabilityStatus() {
    this.isReady = !this.isReady;
    emitChangeLobbyUserAvailabilityInPrivateLobby(this.getPlayerSocket(), {
      availability: this.isReady,
      lobbyId: this.getPrivateLobbyId()
    });
  }

  leavePrivateLobby() {
    emitLeavePrivateLobby(this.getPlayerSocket());
    this.$store.commit("setPrivateLobby", {});
    this.isReady = false;
  }
}
</script>