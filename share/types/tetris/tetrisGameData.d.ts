import { TetrisPrivatePlayerGameData } from "./tetrisPrivatePlayerGameData";
import { TetrisPublicPlayerGameData } from "./tetrisPublicPlayerGameData";

export interface TetrisGameData {
  private: TetrisPrivatePlayerGameData;
  otherPlayers: TetrisPublicPlayerGameData[];
}