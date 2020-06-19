import { LobbyUser } from "./LobbyUser";
import log from "../private-module/PrivateLogger";

export class LobbyUsersManager {
  private static instance: LobbyUsersManager;

  private lobbyUsers: LobbyUser[];

  private constructor() {
    this.lobbyUsers = [];
  }

  static getInstance(): LobbyUsersManager {
    if (!LobbyUsersManager.instance) {
      LobbyUsersManager.instance = new LobbyUsersManager();
    }
    return LobbyUsersManager.instance;
  }

  createLobbyUser(socket: SocketIO.Socket, lobbyUserName?): LobbyUser | null {
    try {
      if (this.getLobbyUserWithSocketId(socket.id)) {
        throw this.errorSocketIsAlreadyReferenced(socket.id);
      } else {
        const pseudo = lobbyUserName ? lobbyUserName : `Anonymous lobbyUser ${this.lobbyUsers.length + 1}`;
        const newLobbyUser = new LobbyUser(socket, pseudo);
        this.lobbyUsers.push(newLobbyUser);
        return newLobbyUser;
      }
    } catch (error) {
      log.error(`Problem when adding lobbyUser in LobbyUsersManager: ${error}`);
      return null;
    }
  }

  removeLobbyUser(socket: SocketIO.Socket): void {
    try {
      const indexOfLobbyUserToDelete = this.lobbyUsers.findIndex(
        (lobbyUser) => lobbyUser.id === socket.id
      );
      if (indexOfLobbyUserToDelete !== -1) {
        this.lobbyUsers.splice(indexOfLobbyUserToDelete, 1);
        log.info(`LobbyUser with id ${socket.id} was removed from LobbyUsersManager`);
      } else {
        throw this.errorSocketIsNotReferenced(socket.id);
      }
    } catch (error) {
      log.error(`Problem when trying to removed lobbyUser from LobbyUsersManager: ${error}`);
    }
  }

  getLobbyUserWithSocketId(socketId: string): LobbyUser | undefined {
    return this.lobbyUsers.find((lobbyUser) => lobbyUser.id === socketId);
  }

  /**
   * Just to tests purpose
   */
  getLobbyUsers():LobbyUser[] | string {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In LobbyUsersManager, getLobbyUsers called")
        return this.lobbyUsers;
      } else {
        throw this.errorTryingGetAllLobbyUsersOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
      return "Can't get lobbyUsers just like that you know"
    }
  }

  /**
   * Just to tests purpose
   */
  resetLobbyUsers() {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In LobbyUsersManager, resetLobbyUsers called")
        this.lobbyUsers = [];
      } else {
        throw this.errorTryingResetLobbyUsersOutsideTestEnv();
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

  private errorTryingResetLobbyUsersOutsideTestEnv(): string {
    return `WARNING: something try to reset lobbyUsers outside test env`
  }

  private errorTryingGetAllLobbyUsersOutsideTestEnv(): string {
    return `WARNING: something try to get all lobbyUsers outside test env`
  }
}
