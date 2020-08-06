<template>
  <div>
    <canvas id="game-canvas" width="1200" height="800"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  loadTetrisPartyEventsListener,
  emitClientLoadedGame,
} from "../socket/tetrisEvents";

@Component({
  name: "fur-tetris-party",
})
export default class extends Vue {
  ctx!: CanvasRenderingContext2D;

  mounted() {
    const canvas: any = document.getElementById("game-canvas"); // Must use any, if using cast parsing error
    this.ctx = canvas.getContext("2d");
    loadTetrisPartyEventsListener(
      this.playerSocket,
      this.$store,
      true
    );
    // TODO: remove, just for test purpose
    setTimeout(() => {
      emitClientLoadedGame(this.playerSocket);
    }, 1000);
  }

  get playerSocket(): SocketIOClient.Socket {
    return this.$store.getters.getPlayerSocket;
  }
}
</script>