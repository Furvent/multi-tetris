<template>
  <div>
    <canvas id="game-canvas" width="1200" height="800"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  TetrisGameController,
  TetrisGameOptions,
} from "../gameCore/TetrisGameController";
import {
  loadTetrisPartyEventsListener,
  emitClientLoadedGame,
} from "../socket/tetrisEvents";

@Component({
  name: "fur-tetris-party",
})
export default class extends Vue {
  ctx!: CanvasRenderingContext2D;
  party!: TetrisGameController;

  mounted() {
    const canvas: any = document.getElementById("game-canvas"); // Must use any, if using cast parsing error
    this.ctx = canvas.getContext("2d");
    loadTetrisPartyEventsListener(this.playerSocket, this.$store, true);
    const options: TetrisGameOptions = {
      numberOfPlayer: this.$store.getters.getNumberOfPlayer,
    };
    this.party = new TetrisGameController(
      {
        ctx: this.ctx,
        canvas
      },
      this.playerSocket,
      options,
      this.$store
    );
    emitClientLoadedGame(this.playerSocket);
  }

  get playerSocket(): SocketIOClient.Socket {
    return this.$store.getters.getPlayerSocket;
  }

  get getCtx(): CanvasRenderingContext2D {
    return this.ctx;
  }

  get getParty(): TetrisGameController {
    return this.party;
  }
}
</script>