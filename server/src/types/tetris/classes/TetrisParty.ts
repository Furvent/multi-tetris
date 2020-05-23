import { IParty } from "../../interfaces/IParty";
import { Lobby } from "../../classes/Lobby";
import { IngamePlayer } from "../../classes/party/IngamePlayer";
import { TetrisPlayer } from "./TetrisPlayer";

export class TetrisParty implements IParty {
  id: string;
  players: IngamePlayer[];

  constructor(lobby: Lobby, id: string) {
    this.id = id;
    this.players = lobby.players.map(player => new TetrisPlayer(player))
    this.initiateGame()
  }
  
  connectPartyToSocketIORoom() {
    throw new Error("Method not implemented.");
  }

  updateLoop() {
    throw new Error("Method not implemented.");
  }

  sendDataToClient() {
    throw new Error("Method not implemented.");
  }

  private initiateGame() {
    throw new Error("Method not implemented.");
  }
  
}