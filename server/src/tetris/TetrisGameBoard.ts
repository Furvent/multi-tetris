
import log from "../private-module/PrivateLogger";
import { TetrominoBlueprint, Tetromino } from "./Tetromino";
import { shuffle } from "../utils/index";

/**
 * An Tetris grid is 10 cells width and 22 cells height. Means it's 220 cells numbered 1 to 220, from left top to right bottom.
 */
export class TetrisGameBoard {
  /**
   * Array use to store cells occupied by static tetromino, those already positionned at the bottom of the board.
   */
  private _tetrominosSequence: string[];
  private _occupiedCells: number[];
  private readonly tetrominosConfig: TetrominoBlueprint[];

  constructor(tetrominosConfig: TetrominoBlueprint[]) {
    this._occupiedCells = [];
    this._tetrominosSequence = [];
    this.tetrominosConfig = tetrominosConfig;
  }

  get tetrominosSequence(): string[] {
    return this.tetrominosSequence;
  }

  get occupiedCells(): number[] {
    return this._occupiedCells;
  }

  public isTetrominosSequenceEmpty() {
    return this._tetrominosSequence.length <= 0; 
  }

  public createTetrominosSequence(): void {
    try {
      if (this._tetrominosSequence.length > 0) {
        throw `tetromino sequence isn't empty but a new one is created`;
      }
      let tetrominosNames = this.tetrominosConfig.map((blueprint) => {
        return blueprint.name;
      });
      this._tetrominosSequence = shuffle(tetrominosNames);
    } catch (error) {
      `Problem when trying to create a new tetromino sequence: ${error}`;
    }
  }

  /**
   * Loop call by the party
   */
  public updateLoop() {}
}
