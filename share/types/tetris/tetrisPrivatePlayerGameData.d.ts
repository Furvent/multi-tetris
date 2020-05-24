import { TetrisPublicPlayerGameData } from "./tetrisPublicPlayerGameData";

export interface TetrisPrivatePlayerGameData extends TetrisPublicPlayerGameData {
  isDisconnected: boolean;
}