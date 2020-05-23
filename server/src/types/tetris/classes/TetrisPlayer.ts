import { IngamePlayer } from "../../classes/party/IngamePlayer";
import { Player } from "../../classes/Player";

export class TetrisPlayer extends IngamePlayer {
  constructor(playerFromLobby: Player) {
    super(playerFromLobby)
  }
}