import { GameTimer } from "../utils/GameTimer";
import { BoardPosition } from "../../../share/types/tetris/tetrisGameData";

export class Tetromino {
  blueprint: TetrominoBlueprint;
  currentDirection: TetrominoDirection;
  private _currentPosition: BoardPosition[];
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

  get currentPosition(): BoardPosition[] {
    return this._currentPosition;
  }

  set currentPosition(newPosition: BoardPosition[]) {
    this._currentPosition = newPosition;
  }

  public getCurrentShape(): BoardPosition[] {
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
  public movementTimerEnded(): boolean {
    return this.timer.isOver;
  }

  public launchTimer(): void {
    this.timer.launch();
  }
}

/**
 * With this data we can place a tetromino on board. Shapes are different position in an area with a fixe square side.
 * There is side * side positions in an area.
 * Example with the 'J' tetromino
 * |_|X|X|_| This is the tetromino area with a side of 4 for 16 positions
 * |_|X|_|_| It is oriented to bottom
 * |_|X|_|_| Tetromino is occupying positions {x: 2, y: 1}, {x: 3, y: 1}, {x: 2, y: 2} and {x: 2, y: 3}
 * |_|_|_|_|
 * 
 * |X|_|_|_| Now it is oriented to right
 * |X|X|X|_| And it is occupying positions {x: 2, y: 1}, {x: 3, y: 1}, {x: 2, y: 2} and {x: 2, y: 3}
 * |_|_|_|_| 
 * |_|_|_|_|
 */
export type TetrominoBlueprint = {
  name: string;
  side: number;
  shapes: {
    top: BoardPosition[];
    right: BoardPosition[];
    bottom: BoardPosition[];
    left: BoardPosition[];
  };
}

export enum TetrominoDirection {
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left",
  TOP = "top",
}
