export interface TetrisGameData {
  privateData: TetrisPrivatePlayerGameData;
  othersPlayersData: TetrisPublicPlayerGameData[];
}

export interface TetrisPrivatePlayerGameData extends TetrisPublicPlayerGameData {
  debugMessage: string;
}

export type InitTetrisPartyData = {
  numberOfPlayer: number;
  boardDimension: BoardDimension;
}

export type TetrisPublicPlayerGameData = {
  gameId: number;
  pseudo: string;
  staticCells: BoardPosition[]
  currentTetrominoCells?: BoardPosition []
}

export type BoardPosition = {
  x: number,
  y: number
}

/**
 * Dimension in cells
 */
type BoardDimension = {
  width: number;
  height: number;
}