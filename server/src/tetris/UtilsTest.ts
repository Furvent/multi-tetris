import { TetrominoBlueprint } from "./Tetromino";
import { BoardDimension } from "./TetrisPartyPositionsUtils";

export const mockedBlueprintTetrominoTypeJ: TetrominoBlueprint = {
  name: "J",
  side: 4,
  shapes: {
    top: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    right: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    bottom: [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    left: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ],
  },
};

export const mockedBoardDimension: BoardDimension = {
  width: 10,
  height: 22,
}
