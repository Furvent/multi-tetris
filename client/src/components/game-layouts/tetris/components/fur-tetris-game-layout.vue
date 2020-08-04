<template>
  <div class="tetris-main-component-container">
    <!-- To show and create Lobbies -->
    <v-container v-if="!displayPartyComponent">
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
                  <v-col cols="4">Players: {{ lobby.numberOfLobbyUsers }}</v-col>
                  <v-col cols="4">
                    <v-btn class="text-center" @click="joinLobby(lobby.id)">JOIN LOBBY</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>
          <!-- When inside a private lobby -->
          <fur-tetris-private-lobby v-if="isInPrivateLobby"></fur-tetris-private-lobby>
        </v-col>
      </v-row>
    </v-container>
    <div v-else>
      <fur-tetris-party></fur-tetris-party>
    </div>
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
  loadLobbyEventsListener,
  emitGetLobbies,
  emitJoinLobby,
  emitCreateNewLobby,
} from "../../socket/lobbyEvents";
import { emitCreateNewLobbyUser } from "../../socket/lobbyUserEvents";
import FurTetrisPrivateLobby from "./fur-tetris-private-lobby.vue";
import FurTetrisParty from "./fur-tetris-party.vue";

@Component({
  name: "fur-tetris-game-layout",
  components: {
    FurTetrisPrivateLobby,
    FurTetrisParty,
  },
})
export default class extends Vue {
  partyNameTextField = "";

  mounted() {
    if (this.getPlayerSocket() === undefined) {
      this.createSocketAndLoadListeners();
    }
  }

  get publicLobbies() {
    return this.$store.getters.getPublicLobbies;
  }

  get isInPrivateLobby(): boolean {
    return this.$store.getters.getPrivateLobby.lobbyUsers !== undefined;
  }

  get displayPartyComponent(): boolean {
    return this.$store.getters.getHaveServerAskedToLoadGame;
  }

  getPlayerSocket(): SocketIOClient.Socket {
    return this.$store.getters.getPlayerSocket;
  }

  createNewLobby() {
    emitCreateNewLobby(this.getPlayerSocket(), this.partyNameTextField);
    this.partyNameTextField = "";
  }

  joinLobby(id: number) {
    emitJoinLobby(this.getPlayerSocket(), id);
  }

  createSocketAndLoadListeners() {
    const socket = io("http://localhost:7070");
    this.$store.commit("setPlayerSocket", socket);
    loadLobbyEventsListener(socket, this.$store, true);
    emitCreateNewLobbyUser(socket, this.$store.getters.getOwnPseudo);
    emitGetLobbies(socket);
  }
}
</script>