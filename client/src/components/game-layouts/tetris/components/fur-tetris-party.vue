<template>
  <div>
    <canvas id="game-canvas" width="1200" height="800"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { loadTetrisPartyEventsListener, emitClientLoadedGame } from "../socket/tetrisEvents";

@Component({
  name: "fur-tetris-game-layout"
})
export default class extends Vue {
  ctx: CanvasRenderingContext2D;

  mounted() {
    const canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    this.ctx = canvas.getContext("2d");
    loadTetrisPartyEventsListener(this.getPlayerSocket(), this.$store, true);
    // TODO: remove, just for test purpose
    setTimeout(() => {
      emitClientLoadedGame(this.getPlayerSocket());
    }, 1000);
  }

  getPlayerSocket(): SocketIOClient.Socket {
    return this.$store.getters.getPlayerSocket;
  }
}
</script>

<style scoped>
</style>