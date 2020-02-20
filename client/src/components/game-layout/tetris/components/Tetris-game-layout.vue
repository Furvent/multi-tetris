<template>
  <div class="tetris-main-component-container">
    <!-- To show and create Lobbies -->
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <!-- Add Lobby  -->
          <div class="tetris-lobby-searched" v-if="!isInPrivateLobby">
            <v-card>
              <v-container>
                <v-row align="center">
                  <v-col cols="8">
                    <v-text-field
                      name="name"
                      label="Enter lobby's name"
                      id="id"
                      v-model="partyNameTextField"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      class="text-center"
                      :disabled="partyNameTextField == ''"
                      @click="createNewLobby()"
                    >CREATE LOBBY</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
            <!-- Lobbies  -->
            <v-card v-for="lobby in publicLobbies" :key="lobby.id">
              <v-container>
                <v-row align="center">
                  <v-col cols="4">Lobby's name: {{ lobby.name }}</v-col>
                  <v-col cols="4">Players: {{ lobby.numberOfPlayers }}</v-col>
                  <v-col cols="4">
                    <v-btn class="text-center" @click="joinLobby(lobby.id)">JOIN LOBBY</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>
          <!-- When inside a private lobby -->
          <tetris-private-lobby
            v-if="isInPrivateLobby"
          >
            
          </tetris-private-lobby>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import io from "socket.io-client";
import { PayloadPublicLobby } from "../../../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../../../share/types/PayloadPrivateLobby";
import { logListener } from "../../../../utils";
import {
  emitGetLobbies,
  loadLobbyEventsListener,
  emitJoinLobby,
  emitCreateNewLobby
} from "../../socket/lobby-events";
import TetrisPrivateLobby from "./Tetris-private-lobby.vue";

@Component({
  name: "tetris-game-layout",
  components: {
    TetrisPrivateLobby
  }
})
export default class extends Vue {
  partyNameTextField = "";
  hasJoinedPrivateLobby = false;

  mounted() {
    if (this.getPlayerSocket() === undefined)
      this.$store.commit("setPlayerSocket", io("http://localhost:7070"));
    loadLobbyEventsListener(this.getPlayerSocket(), this.$store, true);
    emitGetLobbies(this.getPlayerSocket());
  }

  get publicLobbies() {
    return this.$store.getters.getPublicLobbies;
  }

  get privateLobby() {
    return this.$store.getters.getPrivateLobby;
  }

  get isInPrivateLobby(): boolean {
    return this.$store.getters.getPrivateLobby.players !== undefined
  }

  getPlayerSocket() {
    return this.$store.getters.getPlayerSocket;
  }

  createNewLobby() {
    emitCreateNewLobby(this.getPlayerSocket(), this.partyNameTextField);
    this.partyNameTextField = "";
  }

  joinLobby(id: number) {
    emitJoinLobby(this.getPlayerSocket(), id);
  }
}
</script>