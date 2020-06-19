/**
 * - Loading is the state when clients are loading game's assets, and server is created a new party
 */
export enum TetrisGameState {
  Loading = "LOADING",
  Running = "RUNNING",
  Finished = "FINISHED"
}