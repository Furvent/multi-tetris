import { TetrisPrivatePlayerGameData } from "./tetrisPrivatePlayerGameData";
import { TetrisPublicPlayerGameData } from "./tetrisPublicPlayerGameData";

export interface TetrisGameData {
  privateData: TetrisPrivatePlayerGameData;
  otherPlayersData: TetrisPublicPlayerGameData[];
}