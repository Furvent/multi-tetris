import { IParty } from "../interfaces/IParty";
import { Lobby } from "../lobby/Lobby";
import { TetrisPlayer } from "./TetrisPlayer";
import { ISocketIORoom } from "../interfaces/ISocketIORoom";
import * as events from "../socket/tetris/index";
import log from "../private-module/PrivateLogger";
import { TetrisPublicPlayerGameData } from "../../../share/types/tetris/tetrisPublicPlayerGameData";
import { TetrisGameData } from "../../../share/types/tetris/tetrisGameData";
import { IngamePlayer } from "../party/IngamePlayer";

export class TetrisParty extends IParty implements ISocketIORoom {
  id: string;
  private socketIORoomName: string;
  protected players: TetrisPlayer[];
  gameState: string;

  constructor(lobby: Lobby, id: string) {
    super();
    this.id = id;
    this.players = lobby.lobbyUsers.map(
      (player, index) => new TetrisPlayer(player, index)
    );
    this.socketIORoomName = `party${this.id}`;
    this.connectPlayersSocketsToSocketIORoomAndLoadEventsListener();
    this.gameState = TetrisGameState.Loading;
    this.initiateGame();
  }

  updateLoop(): void {
    log.debug(`Update loop called in party with id ${this.id}`);
    switch (this.gameState) {
      case TetrisGameState.Loading:
        this.checkIfAllPlayersLoadedTheGameAndSetTetrisGameState();
        break;

      default:
        break;
    }
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

  protected connectPlayersSocketsToSocketIORoomAndLoadEventsListener(): void {
    try {
      this.players.forEach((player) => {
        // .join is async call, that's why we emit the event to load game only when we are sure socket is in the room
        player.socket.join(this.socketIORoomName, () => {
          events.emitAskClientToLoadGame(player.socket);
        });
        events.loadTetrisEventsListener(player.socket);
      });
    } catch (error) {
      log.error(
        `Problem in method connectPlayersSocketsToSocketIORoomAndLoadEventsListener():${error}`
      );
    }
  }

  private initiateGame(): void {
    // TODO: créer une nouvelle partie sur le serveur
  }

  private checkIfAllPlayersLoadedTheGameAndSetTetrisGameState(): void {
    if (this.players.every((player) => player.hasLoadedGame)) {
      this.gameState = TetrisGameState.Running;
    }
  }

  /**
   * Create an array with all public data from each player (positions on board)
   */
  private createPlayersGameDataToEmit(): TetrisPublicPlayerGameData[] {
    return this.players.map((player) => player.exportPublicGameData());
  }

  /**
   * Socket emit his private data and others players public data
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

/**
 * - Loading is the state when clients are loading game's assets, and server is created a new party
 */
enum TetrisGameState {
  Loading = "LOADING",
  Running = "RUNNING",
  Finished = "FINISHED",
}
