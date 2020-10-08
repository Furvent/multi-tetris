import { GameInput } from "./GameInput";
import { TetrisGameRenderer } from "./render/TetrisGameRenderer";
import { Store } from "vuex";
import {
  BoardDimension,
  TetrisPrivatePlayerGameData,
  TetrisPublicPlayerGameData,
} from "../../../../../../share/types/tetris/tetrisGameData";

export class TetrisGameController {
  readonly FPS = 30;
  readonly LOOP_TIMEOUT = Math.round(1000 / this.FPS);
  // private ctx: CanvasRenderingContext2D;
  private pSocket: SocketIOClient.Socket;
  private options: TetrisGameOptions;
  private gameInput: GameInput;
  private gameRenderer: TetrisGameRenderer | null;
  private store: Store<any>;

  constructor(
    canvasRefs: CanvasRefs,
    playerSocket: SocketIOClient.Socket,
    options: TetrisGameOptions,
    store: Store<any>
  ) {
    this.pSocket = playerSocket;
    this.options = options;
    this.gameInput = new GameInput();
    this.gameRenderer = null;
    this.store = store;
    try {
      const numberOfPlayers: number = this.store.getters.getNumberOfPlayer;
      const boardDimension: BoardDimension = {
        width: 10,
        height: 22,
      };
      this.gameRenderer = new TetrisGameRenderer(
        canvasRefs.ctx,
        {
          width: canvasRefs.canvas.width,
          height: canvasRefs.canvas.height,
        },
        boardDimension,
        numberOfPlayers
      );
      this.init();
    } catch (error) {
      console.error(`Error when init TetrisGameController: ${error}`);
    }
  }

  private init() {
    this.gameLoop();
  }

  private gameLoop() {
    setInterval(() => {
      // Force store type
      // TetrisPrivatePlayerGameData && TetrisPublicPlayerGameData is more or less LocalPlayerDataToDraw && CommonPlayerBoardDataToDraw
      // To improve
      const localPlayerData: TetrisPrivatePlayerGameData = this.store.getters
        .getLocalPlayerData;
      const othersPlayersData: TetrisPublicPlayerGameData[] = this.store.getters
        .getOthersPlayersData;

      if (this.gameRenderer && localPlayerData) {
        this.gameRenderer.draw(localPlayerData, othersPlayersData);
      }
    }, this.LOOP_TIMEOUT);
  }
}

export interface TetrisGameOptions {
  numberOfPlayer: number;
}

type CanvasRefs = {
  ctx: CanvasRenderingContext2D;
  canvas: any;
};
