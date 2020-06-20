import { Lobby } from "./Lobby";
import {
  emitUpdatePrivateLobby,
  emitPublicLobbies,
} from "../socket/lobbies-manager";
import { PayloadPublicLobby } from "../../../share/types/PayloadPublicLobby";
import log from "../private-module/PrivateLogger";
import { LobbyUsersManager } from "./LobbyUsersManager";
import { PartiesManager } from "../party/PartiesManager";

/**
 * Is singleton
 */
export class LobbiesManager {
  private static instance: LobbiesManager;

  private lobbies: Lobby[];
  private idUsedIncrementator: number;

  private constructor() {
    this.lobbies = [];
    this.idUsedIncrementator = 0;
  }
  static getInstance(): LobbiesManager {
    if (!LobbiesManager.instance)
      LobbiesManager.instance = new LobbiesManager();
    return LobbiesManager.instance;
  }

  // Launch party

  lobbyUserJoinLobbyWithId(lobbyId: string, lobbyUser: SocketIO.Socket): void {
    try {
      this.checkIfLobbyUserIsInAnotherLobby(lobbyUser);
      const lobbyToJoin = this.getLobbyWithId(lobbyId);
      if (lobbyToJoin === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      lobbyToJoin.addLobbyUser(lobbyUser);
      emitUpdatePrivateLobby(
        lobbyToJoin.exportInPrivateLobby(),
        lobbyToJoin.getSocketIORoom()
      );
    } catch (error) {
      log.error(
        `Problem when adding user ${lobbyUser.id} to lobby with id ${lobbyId}: ${error}`
      );
    }
  }

  lobbyUserCreateLobby(lobbyUser: SocketIO.Socket, roomName?: string): void {
    try {
      this.checkIfLobbyUserIsInAnotherLobby(lobbyUser);
      const newLobby = new Lobby(
        (this.idUsedIncrementator++).toString(),
        roomName ? roomName : this.createRoomName(lobbyUser.id)
      );
      newLobby.addLobbyUser(lobbyUser);
      this.lobbies.push(newLobby);
      this.lobbyUserAskPublicLobbies(lobbyUser);
      emitUpdatePrivateLobby(
        newLobby.exportInPrivateLobby(),
        newLobby.getSocketIORoom()
      );
    } catch (error) {
      log.error(
        `Problem when lobbyUser ${lobbyUser.id} tried to create new lobby: ${error}`
      );
    }
  }

  lobbyUserAskPublicLobbies(lobbyUser: SocketIO.Socket): void {
    emitPublicLobbies(this.exportAllLobbies(), lobbyUser);
  }

  lobbyUserChangeAvailabiltyStatusInPrivateLobby(
    lobbyUser: SocketIO.Socket,
    lobbyId: string,
    availability: boolean = false
  ): void {
    try {
      const lobby = this.getLobbyWithId(lobbyId);
      if (lobby === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      const lobbyUserSearched = lobby.getLobbyUserWithId(lobbyUser.id);
      if (lobbyUserSearched == undefined) {
        throw this.errorLobbyUserIsNotInThisLobby(lobbyUser.id, lobbyId);
      }

      lobbyUserSearched.isReadyInPrivateLobby = availability;
      emitUpdatePrivateLobby(
        lobby.exportInPrivateLobby(),
        lobby.getSocketIORoom()
      );

      // Launch game
      if (lobby.isGameReadyToLaunch()) {
        this.launchGameToLobby(lobby);
      }
    } catch (error) {
      log.error(
        `In method lobbyUserChangeAvailabiltyStatusInPrivateLobby(), call by lobbyUser ${lobbyUser.id} problem: ${error}`
      );
    }
  }

  lobbyUserLeavePrivateLobby(lobbyUser: SocketIO.Socket): void {
    try {
      const lobbyUserLobby = this.findLobbyUserLobby(lobbyUser);
      if (lobbyUserLobby === undefined) {
        throw this.errorLobbyUserHasNoLobby(lobbyUser.id);
      }
      this.removeLobbyUserFromLobby(lobbyUserLobby, lobbyUser);
    } catch (error) {
      log.error(
        `Problem when lobbyUser ${lobbyUser.id} tried to leave lobby: ${error}`
      );
    }
  }

  lobbyUserDeconnectedFromClient(lobbyUser: SocketIO.Socket): void {
    try {
      const lobbyUserLobby = this.findLobbyUserLobby(lobbyUser);
      if (lobbyUserLobby !== undefined) {
        this.removeLobbyUserFromLobby(lobbyUserLobby, lobbyUser);
      }
    } catch (error) {
      log.error(`Problem when lobbyUser ${lobbyUser.id} deconnected: ${error}`);
    }
  }

  /**
   * Just to tests purpose
   */
  getLobbies(): Lobby[] {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In LobbiesManager, getLobbies called");
        return this.lobbies;
      } else {
        throw this.errorTryingGetAllLobbiesOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  /**
   * Just to tests purpose
   */
  resetLobbies() {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In LobbiesManager, resetLobbies called");
        this.lobbies = [];
      } else {
        throw this.errorTryingResetLobbiesOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
    }
  }

  private exportAllLobbies(): PayloadPublicLobby[] {
    return this.lobbies.map((lobby) => lobby.exportInPublicLobby());
  }

  private getLobbyWithId(id: string): Lobby | undefined {
    const lobbySearched = this.lobbies.find((lobby) => lobby.getId() === id);
    return lobbySearched;
  }

  private findLobbyUserLobby(
    lobbyUserSearched: SocketIO.Socket
  ): Lobby | undefined {
    return this.lobbies.find((lobby) => {
      return lobby.lobbyUsers.some(
        (lobbyUser) => lobbyUser.id === lobbyUserSearched.id
      );
    });
  }

  private checkIfLobbyUserIsInAnotherLobby(lobbyUser: SocketIO.Socket) {
    const lobbyAlreadyOccupied = this.findLobbyUserLobby(lobbyUser);
    if (lobbyAlreadyOccupied !== undefined) {
      throw this.errorLobbyUserIsAlreadyInAnotherLobby(
        lobbyUser.id,
        lobbyAlreadyOccupied.getId()
      );
    }
  }

  private removeLobbyUserFromLobby(
    lobbyUserLobby: Lobby,
    lobbyUserSocket: SocketIO.Socket
  ): void {
    // TODO: implement try catch
    const lobbyUser = LobbyUsersManager.getInstance().getLobbyUserWithSocketId(
      lobbyUserSocket.id
    );
    if (lobbyUser) {
      lobbyUser.isReadyInPrivateLobby = false;
    }
    lobbyUserLobby.removeLobbyUser(lobbyUserSocket);
    if (lobbyUserLobby.isEmpty()) {
      this.deleteEmptyLobby(lobbyUserLobby);
    }
    emitPublicLobbies(this.exportAllLobbies());
    emitUpdatePrivateLobby(
      lobbyUserLobby.exportInPrivateLobby(),
      lobbyUserLobby.getSocketIORoom()
    );
  }

  private deleteEmptyLobby(lobbyToDelete: Lobby) {
    try {
      if (!lobbyToDelete.isEmpty()) {
        throw this.errorCantDeleteLobbyWithLobbyUserInside(
          lobbyToDelete.getId(),
          lobbyToDelete.lobbyUsers.length
        );
      }
      const lobbyToDeleteIndex = this.lobbies.findIndex(
        (lobby) => lobby.getId() === lobbyToDelete.getId()
      );
      this.lobbies.splice(lobbyToDeleteIndex, 1);
    } catch (error) {
      log.error(
        `Problem when trying to delete supposedly empty lobby with id ${lobbyToDelete.getId()}: ${error}`
      );
    }
  }

  private launchGameToLobby(lobby: Lobby): void {
    try {
      // First init party
      PartiesManager.getInstance().addParty(lobby);
      // Then clean lobby
      while (lobby.lobbyUsers.length > 0) {
        lobby.removeLobbyUser(lobby.lobbyUsers[0].socket);
      }
      // And delete lobby
      this.deleteEmptyLobby(lobby);
    } catch (error) {
      log.error(
        `Problem when trying to launch game to lobby with id ${lobby.getId()}: ${error}`
      );
    }
  }

  private createRoomName(lobbyUserId: string): string {
    const lobbyUserPseudo = LobbyUsersManager.getInstance().getLobbyUserWithSocketId(
      lobbyUserId
    )?.pseudo;
    return lobbyUserPseudo
      ? `${lobbyUserPseudo}'s room`
      : `room ${this.idUsedIncrementator}`;
  }

  private errorLobbyUserIsAlreadyInAnotherLobby(
    lobbyUserId: string,
    lobbyId: string
  ): string {
    return `LobbyUser ${lobbyUserId} is already in lobby: ${lobbyId}`;
  }

  private errorNoLobbyWithThatId(id: string): string {
    return `No lobby with id: ${id}`;
  }

  private errorLobbyUserIsNotInThisLobby(
    lobbyUserId: string,
    lobbyId: string
  ): string {
    return `LobbyUser ${lobbyUserId} is not in lobby: ${lobbyId}`;
  }

  private errorLobbyUserHasNoLobby(lobbyUserId: string): string {
    return `LobbyUser ${lobbyUserId} has no lobby`;
  }

  private errorCantDeleteLobbyWithLobbyUserInside(
    lobbyId: string,
    numberOfLobbyUsers: number
  ): string {
    return `Can't delete lobby with id ${lobbyId}, still ${numberOfLobbyUsers} lobbyUser(s) inside`;
  }

  private errorTryingResetLobbiesOutsideTestEnv(): string {
    return `WARNING: something try to reset lobbies outside test env`;
  }

  private errorTryingGetAllLobbiesOutsideTestEnv(): string {
    return `WARNING: something try to get all lobbies outside test env`;
  }
}
