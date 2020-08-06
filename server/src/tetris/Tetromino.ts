import { GameTimer } from "../utils/GameTimer";

export class Tetromino {
  blueprint: TetrominoBlueprint;
  currentDirection: TetrominoDirection;
  _currentPosition: number[];
  timer: GameTimer;

  constructor(
    blueprint: TetrominoBlueprint,
    moveTick: number,
    currentDirection = TetrominoDirection.RIGHT
  ) {
    this.blueprint = blueprint;
    this.currentDirection = currentDirection;
    this._currentPosition = [];
    this.timer = new GameTimer(moveTick);
  }

  get currentPosition(): number[] {
    return this._currentPosition;
  }

  set currentPosition(newPosition: number[]) {
    this._currentPosition = newPosition;
  }

  public getCurrentShape(): number[] {
    return this.blueprint.shapes[this.currentDirection];
  }

  public getSide(): number {
    return this.blueprint.side;
  }

  public getName(): string {
    return this.blueprint.name;
  }

  public turn(): void {
    switch (this.currentDirection) {
      case TetrominoDirection.RIGHT: {
        this.currentDirection = TetrominoDirection.BOTTOM;
        break;
      }
      case TetrominoDirection.BOTTOM: {
        this.currentDirection = TetrominoDirection.LEFT;
        break;
      }
      case TetrominoDirection.LEFT: {
        this.currentDirection = TetrominoDirection.TOP;
        break;
      }
      case TetrominoDirection.TOP: {
        this.currentDirection = TetrominoDirection.RIGHT;
        break;
      }
    }
  }

  public initiateMovementTimer(): void {
    this.timer.launch();
  }

  public setNewMovementTimerDuration(duration: number): void {
    this.timer.setNewDuration(duration);
  }

  /**
   * Use to know if tetromino can be moved
   */
  public movementTimerEnded() {
    return this.timer.isOver;
  }
}

/**
 * With this data we can place a tetromino on board. Shapes are different position in an area with a fixe square side.
 * There is side * side positions in an area.
 * |_|X|X|_| This is the tetromino area with a side of 4 for 16 positions
 * |_|X|_|_| Tetromino is occupied position 2, 3, 6 and 10
 * |_|X|_|_|
 * |_|_|_|_|
 */
export interface TetrominoBlueprint {
  name: string;
  side: number;
  shapes: {
    top: number[];
    right: number[];
    bottom: number[];
    left: number[];
  };
}

export enum TetrominoDirection {
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left",
  TOP = "top",
}
