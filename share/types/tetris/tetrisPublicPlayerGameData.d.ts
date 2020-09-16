export type TetrisPublicPlayerGameData = {
  gameId: number;
  pseudo: string;
  board: BoardPosition[]
  currentTetromino: BoardPosition []
}

export type BoardPosition = {
  x: number,
  y: number
}