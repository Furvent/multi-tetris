import { TetrominoBlueprint } from "./Tetromino";
import { BoardDimension } from "./TetrisPartyPositionsUtils";
import { BoardPosition } from "../../../share/types/tetris/tetrisGameData";

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

export const mockedTetrominoTypeJPositionsCreationAtRight: BoardPosition[] = [
  {x: 4, y: 1},
  {x: 4, y: 2},
  {x: 5, y: 2},
  {x: 6, y: 2},
]

export const mockedBoardDimension: BoardDimension = {
  width: 10,
  height: 22,
}

export const mockedOccupiedStaticCells1: BoardPosition[] = [
  {x: 4, y: 22},
  {x: 5, y: 22},
  {x: 6, y: 22},
  {x: 7, y: 22},
]

export const mockedOccupiedStaticCells2: BoardPosition[] = [
  {x: 4, y: 2},
  {x: 5, y: 2},
  {x: 6, y: 2},
  {x: 7, y: 2},
]
