import { IngamePlayer } from "../../classes/party/IngamePlayer";
import { Player } from "../../classes/Player";
import { TetrisPrivatePlayerGameData } from "../../../../../share/types/tetris/tetrisPrivatePlayerGameData"
import { TetrisPublicPlayerGameData } from "../../../../../share/types/tetris/tetrisPublicPlayerGameData"

export class TetrisPlayer extends IngamePlayer {
  constructor(playerFromLobby: Player, gameId: number) {
    super(playerFromLobby, gameId)
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