import { GameInput } from "./GameInput";

export class TetrisGameController {
  readonly FPS = 30;
  private ctx: CanvasRenderingContext2D;
  private pSocket: SocketIOClient.Socket;
  private options: TetrisGameOptions;
  private gameInput: GameInput;

  constructor(
    ctx: CanvasRenderingContext2D,
    playerSocket: SocketIOClient.Socket,
    options: TetrisGameOptions
  ) {
    this.ctx = ctx;
    this.pSocket = playerSocket;
    this.options = options;
    this.gameInput = new GameInput();
    this.init();
  }

  private init() {
    this.gameLoop();
  }

  private gameLoop() {
    setInterval(() => {});
  }
}

export interface TetrisGameOptions {
  numberOfPlayer: number;
}
