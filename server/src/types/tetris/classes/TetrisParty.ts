import { IParty } from "../../interfaces/IParty";
import { Lobby } from "../../classes/Lobby";
import { TetrisPlayer } from "./TetrisPlayer";
import { ISocketIORoom } from "../../interfaces/ISocketIORoom";
import * as events from "../../../socket/tetris/index";
import log from "../../../private-module/PrivateLogger";
import { TetrisPublicPlayerGameData } from "../../../../../share/types/tetris/tetrisPublicPlayerGameData";
import { TetrisGameData } from "../../../../../share/types/tetris/tetrisGameData";
import { IngamePlayer } from "../../classes/party/IngamePlayer";

export class TetrisParty extends IParty implements ISocketIORoom {
  id: string;
  private socketIORoomName: string;
  protected players: TetrisPlayer[];
  gameState: string;

  constructor(lobby: Lobby, id: string) {
    super();
    this.id = id;
    this.players = lobby.players.map(
      (player, index) => new TetrisPlayer(player, index)
    );
    this.socketIORoomName = `party${this.id}`;
    this.connectPlayersSocketsToSocketIORoomAndLoadEventsListener();
    this.gameState = TetrisGameState.Loading;
    this.initiateGame();
  }

  connectPlayersSocketsToSocketIORoomAndLoadEventsListener() {
    this.players.forEach((player) => {
      player.socket.join(this.socketIORoomName);
      events.loadTetrisEventsListener(player.socket);
    });
  }

  updateLoop() {
    log.debug(`Update loop called in party with id ${this.id}`);
  }

  /**
   * For each player, emit private and public data game
   */
  sendDataToClients() {
    const playersGameData = this.createPlayersGameDataToEmit();
    this.players.forEach((player) => {
      this.sendDataToSocket(player, playersGameData);
    });
  }

  getId(): string {
    return this.id;
  }

  getSocketIORoom(): string {
    return this.socketIORoomName;
  }

  getPlayerWithId(playerSearchedSocketId: string): IngamePlayer | null {
    const playerToFind = this.players.find(
      (player) => player.socket.id === playerSearchedSocketId
    );
    return playerToFind ? playerToFind : null;
  }

  private initiateGame() {
    events.emitAskClientToLoadGame(this.socketIORoomName);
    throw new Error("Method not implemented.");
  }

  /**
   * Create an array with all public data from each player (positions on board)
   */
  private createPlayersGameDataToEmit(): TetrisPublicPlayerGameData[] {
    return this.players.map((player) => player.exportPublicGameData());
  }

  /**
   * For each player send his private data and others players public data
   */
  private sendDataToSocket(
    player: TetrisPlayer,
    playersGameData: TetrisPublicPlayerGameData[]
  ): void {
    const payload: TetrisGameData = {
      privateData: player.exportPrivateGameData(),
      otherPlayersData: playersGameData.filter(
        (otherPlayer) => otherPlayer.gameId !== player.gameId
      ),
    };
    events.emitTetrisGameData(player.socket, payload);
  }
}
