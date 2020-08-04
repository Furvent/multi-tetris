import { IParty } from "../interfaces/IParty";
import { Lobby } from "../lobby/Lobby";
import { TetrisPlayer } from "./TetrisPlayer";
import { ISocketIORoom } from "../interfaces/ISocketIORoom";
import * as events from "../socket/tetris/index";
import log from "../private-module/PrivateLogger";
import { TetrisPublicPlayerGameData } from "../../../share/types/tetris/tetrisPublicPlayerGameData";
import { TetrisGameData } from "../../../share/types/tetris/tetrisGameData";
import { IngamePlayer } from "../party/IngamePlayer";
import { TetrisGameState } from "./enums/tetrisGameState";

export class TetrisParty extends IParty implements ISocketIORoom {
  id: string;
  private socketIORoomName: string;
  protected players: TetrisPlayer[];
  gameState: string;

  constructor(config: TetrisPartyConfig) {
    super();
    this.id = config.id;
    if (config.lobby) {
      this.players = config.lobby.lobbyUsers.map(
        (player, index) => new TetrisPlayer(player, index)
      );
    } else if (config.player){
      this.players = [];
      this.players.push(config.player)
    } else {
      this.players = [];
      throw 'New party created without player, there is a problem';
    }

    this.socketIORoomName = `party${this.id}`;
    this.connectPlayersSocketsToSocketIORoomAndLoadEventsListener();
    this.gameState = TetrisGameState.Loading;
    this.initiateGame();
  }

  connectPlayersSocketsToSocketIORoomAndLoadEventsListener(): void {
    this.players.forEach((player) => {
      player.socket.join(this.socketIORoomName);
      events.loadTetrisEventsListener(player.socket);
    });
  }

  updateLoop(): void {
    log.debug(`Update loop called in party with id ${this.id}`);
  }

  /**
   * For each player, emit private and public data game
   */
  sendDataToClients(): void {
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
    try {
      events.emitAskClientToLoadGame(this.socketIORoomName);
    } catch (error) {
      log.error(error);
    }
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

interface TetrisPartyConfig {
  id: string;
  lobby?: Lobby;
  player?: TetrisPlayer;
}
