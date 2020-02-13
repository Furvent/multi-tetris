<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="8" >
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
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import io from "socket.io-client";

@Component({
  name: "tetris-game-layout"
})
export default class extends Vue {
  socket: SocketIOClient.Socket;
  partyNameTextField = "";

  mounted() {
    if (this.socket === undefined) this.socket = io("http://localhost:7070");
  }

  /**
   * Not found other way to debug in devtools on chrome
   */
  get computedSocket() {
    return this.socket;
  }

  get publicLobbies() {
    return this.$store.getters.getPublicLobbies
  }

  get privateLobby() {
    return this.$store.getters.getPrivateLobby
  }

  createNewLobby() {
    this.socket.emit('lobby:createNewLobby', this.partyNameTextField)
  }
}
</script>