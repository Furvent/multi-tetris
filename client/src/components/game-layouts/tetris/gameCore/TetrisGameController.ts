import { GameInput } from "./GameInput";
import { TetrisGameRenderer } from "./render/TetrisGameRenderer";
import { Store } from "vuex";
import { BoardDimension, TetrisPrivatePlayerGameData, TetrisPublicPlayerGameData } from "../../../../../../share/types/tetris/tetrisGameData";

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
    ctx: CanvasRenderingContext2D,
    playerSocket: SocketIOClient.Socket,
    options: TetrisGameOptions,
    store: Store<any>
  ) {
    // this.ctx = ctx;
    this.pSocket = playerSocket;
    this.options = options;
    this.gameInput = new GameInput();
    this.gameRenderer = null;
    this.store = store;
    try {
      const numberOfPlayers: number = this.store.getters.getNumberOfPlayer;
      const boardDimension: BoardDimension = this.store.getters.getNumberOfPlayer;
      this.gameRenderer = new TetrisGameRenderer(
        ctx,
        boardDimension,
        numberOfPlayers
      );
    } catch (error) {
      console.error(`Error when init TetrisGameController: ${error}`);
    }
    this.init();
  }

  private init() {
    this.gameLoop();
  }

  private gameLoop() {
    setInterval(() => {
      // Force store type
      // TetrisPrivatePlayerGameData && TetrisPublicPlayerGameData is more or less LocalPlayerDataToDraw && CommonPlayerBoardDataToDraw
      // To improve
      const localPlayerData: TetrisPrivatePlayerGameData = this.store.getters.getLocalPlayerData;
      const othersPlayersData: TetrisPublicPlayerGameData[] = this.store.getters.getLocalPlayerData;

      this.gameRenderer?.draw(localPlayerData, othersPlayersData);
    }, this.LOOP_TIMEOUT);
  }
}

export interface TetrisGameOptions {
  numberOfPlayer: number;
}
