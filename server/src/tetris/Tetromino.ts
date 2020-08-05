export class Tetromino {

  blueprint: TetrominoBlueprint;
  currentDirection: TetrominoDirection;
  
  constructor(blueprint: TetrominoBlueprint, currentDirection = TetrominoDirection.Right) {
    this.blueprint = blueprint;
    this.currentDirection = currentDirection;
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
    switch(this.currentDirection) {
      case TetrominoDirection.Right: {
        this.currentDirection = TetrominoDirection.Bottom;
        break;
      }
      case TetrominoDirection.Bottom: {
        this.currentDirection = TetrominoDirection.Left;
        break;
      }
      case TetrominoDirection.Left: {
        this.currentDirection = TetrominoDirection.Top;
        break;
      }
      case TetrominoDirection.Top: {
        this.currentDirection = TetrominoDirection.Right;
        break;
      }
    }
  }
}

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
  Right, Bottom, Left, Top
}
