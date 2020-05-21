import { Player } from "./Player";
import log from "../../private-module/PrivateLogger";

export class PlayersManager {
  private static instance: PlayersManager;

  private players: Player[];

  private constructor() {
    this.players = [];
  }

  static getInstance(): PlayersManager {
    if (!PlayersManager.instance) {
      PlayersManager.instance = new PlayersManager();
    }
    return PlayersManager.instance;
  }

  createPlayer(socket: SocketIO.Socket, playerName?): Player | null {
    try {
      if (this.getPlayerWithSocketId(socket.id)) {
        throw this.errorSocketIsAlreadyReferenced(socket.id);
      } else {
        const pseudo = playerName ? playerName : this.players.length + 1;
        const newPlayer = new Player(socket, pseudo);
        this.players.push(newPlayer);
        return newPlayer;
      }
    } catch (error) {
      log.error(`Problem when adding player in PlayersManager: ${error}`);
      return null;
    }
  }

  removePlayer(socket: SocketIO.Socket): void {
    try {
      const indexOfPlayerToDelete = this.players.findIndex(
        (player) => player.id === socket.id
      );
      if (indexOfPlayerToDelete !== -1) {
        this.players.splice(indexOfPlayerToDelete, 1);
        log.info(`Player with id ${socket.id} was removed from PlayersManager`);
      } else {
        throw this.errorSocketIsNotReferenced(socket.id);
      }
    } catch (error) {
      log.error(`Problem when trying to removed player from PlayersManager: ${error}`);
    }
  }

  getPlayerWithSocketId(socketId: string): Player | undefined {
    return this.players.find((player) => player.id === socketId);
  }

  /**
   * Just to tests purpose
   */
  getPlayers():Player[] | string {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In PlayersManager, getPlayers called")
        return this.players;
      } else {
        throw this.errorTryingGetAllPlayersOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
      return "Can't get players just like that you know"
    }
  }

  /**
   * Just to tests purpose
   */
  resetPlayers() {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In PlayersManager, resetPlayers called")
        this.players = [];
      } else {
        throw this.errorTryingResetPlayersOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
    }
  }

  private errorSocketIsAlreadyReferenced(socketId: string): string {
    return `Socket with id ${socketId} is ALREADY referenced`;
  }

  private errorSocketIsNotReferenced(socketId: string): string {
    return `Socket with id ${socketId} is NOT referenced`;
  }

  private errorTryingResetPlayersOutsideTestEnv(): string {
    return `WARNING: something try to reset players outside test env`
  }

  private errorTryingGetAllPlayersOutsideTestEnv(): string {
    return `WARNING: something try to get all players outside test env`
  }
}
