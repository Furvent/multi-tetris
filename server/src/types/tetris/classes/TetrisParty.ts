import { IParty } from "../../interfaces/IParty";
import { Lobby } from "../../classes/Lobby";
import { IngamePlayer } from "../../classes/party/IngamePlayer";
import { TetrisPlayer } from "./TetrisPlayer";
import { ISocketIORoom } from "../../interfaces/ISocketIORoom";
import * as events from "../../../socket/tetris/index";

export class TetrisParty extends IParty implements ISocketIORoom {
  id: string;
  private socketIORoomName: string;
  protected players: IngamePlayer[];

  constructor(lobby: Lobby, id: string) {
    super();
    this.id = id;
    this.players = lobby.players.map(player => new TetrisPlayer(player))
    this.socketIORoomName = `party${this.id}`
    this.connectPlayersSocketsToSocketIORoomAndLoadEventsListener();
    this.initiateGame();
  }

  connectPlayersSocketsToSocketIORoomAndLoadEventsListener() {
    this.players.forEach(player => {
      player.socket.join(this.socketIORoomName);
      events.loadTetrisEventsListener(player.socket);
    })
  }

  updateLoop() {
    throw new Error("Method not implemented.");
  }

  sendDataToClient() {
    throw new Error("Method not implemented.");
  }

  getId(): string {
    return this.id;
  }

  getSocketIORoom(): string {
    return this.socketIORoomName;
  }

  private initiateGame() {
    events.emitAskClientToLoadGame(this.socketIORoomName);
    throw new Error("Method not implemented.");
  }
  
}