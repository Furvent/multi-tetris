import { IngamePlayer } from "../party/IngamePlayer";
import { LobbyUser } from "../lobby/LobbyUser";
import { TetrisPrivatePlayerGameData } from "../../../share/types/tetris/tetrisPrivatePlayerGameData"
import { TetrisPublicPlayerGameData } from "../../../share/types/tetris/tetrisPublicPlayerGameData"
import { TetrominoBlueprint } from "./Tetromino";

export class TetrisPlayer extends IngamePlayer {
  private tetrominosConfig: TetrominoBlueprint[];

  constructor(playerFromLobby: LobbyUser, gameId: number, tetrominosConfig: TetrominoBlueprint[]) {
    super(playerFromLobby, gameId)
    this.tetrominosConfig = tetrominosConfig;
  }

  exportPrivateGameData(): TetrisPrivatePlayerGameData {
    return {
      ...this.exportPublicGameData(),
      isDisconnected: this.isDisconnected
    }
  }

  exportPublicGameData(): TetrisPublicPlayerGameData {
    return {
      gameId: this.gameId,
      pseudo: this.pseudo
    }
  }
}