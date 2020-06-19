import { LobbyUser } from "./LobbyUser";
import { PayloadPublicLobby } from "../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../share/types/PayloadPrivateLobby";
import { LobbyUsersManager } from "./LobbyUsersManager";
import log from "../private-module/PrivateLogger";
import { ISocketIORoom } from "../interfaces/ISocketIORoom";

/**
 * NOTE : C'est dans cette classe que devrait être stocké le fait que les utilisateurs sont prêts, et non pas dans la classe LobbyUser.
 */
export class Lobby implements ISocketIORoom {
  readonly MAX_USER = 2

  lobbyUsers: LobbyUser[];
  private id: string;
  private roomName: string;
  // socketIORoomName == socket.io special channel's name
  private socketIORoomName: string;
  // TODO: Meilleur implémentation (attribuer à la création le type de lobby)
  lobbyType = "tetris";

  constructor(id: string, roomName: string) {
    this.lobbyUsers = [];
    this.id = id;
    this.socketIORoomName = `room${this.id}`;
    this.roomName = roomName;
    log.info(
      `New lobby is created with id ${id}. SocketIORoomName: ${this.socketIORoomName}, roomName: ${this.roomName}`
    );
  }

  isFull(): boolean {
    return this.lobbyUsers.length >= this.MAX_USER;
  }

  isEmpty(): boolean {
    return this.lobbyUsers.length <= 0;
  }

  getId(): string {
    return this.id;
  }

  getSocketIORoom(): string {
    return this.socketIORoomName;
  }

  addLobbyUser(socket: SocketIO.Socket): void {
    try {
      if (this.getLobbyUserWithId(socket.id) !== undefined)
        throw this.errorLobbyUserIsAlreadyInLobby(socket.id);
      else {
        this.addLobbyUserWithLobbyUsersManager(socket);
      }
    } catch (error) {
      log.error(
        `In lobby with id ${this.id}, problem when trying to create a new lobbyUser: ${error}`
      );
    }
  }

  removeLobbyUser(lobbyUserToRemove: SocketIO.Socket): void {
    try {
      const lobbyUserIndex = this.lobbyUsers.findIndex(
        (lobbyUser) => lobbyUser.id === lobbyUserToRemove.id
      );
      if (lobbyUserIndex === -1) {
        throw this.errorThisLobbyUserIsNotInsideLobby(lobbyUserToRemove.id);
      }
      this.lobbyUsers.splice(lobbyUserIndex, 1);
      lobbyUserToRemove.leave(this.socketIORoomName);
    } catch (error) {
      log.error(
        `In lobby with id ${this.id}, problem when trying to delete a lobby user: ${error}`
      );
    }
  }

  getLobbyUserWithId(id: string): LobbyUser | undefined {
    return this.lobbyUsers.find((lobbyUser) => lobbyUser.id === id);
  }

  isGameReadyToLaunch(): boolean {
    return this.isFull() && this.areEveryLobbyUsersReady();
  }

  createPartyFromLobby() {

  }

  exportInPublicLobby(): PayloadPublicLobby {
    return {
      id: this.id,
      isFull: this.isFull(),
      name: this.roomName,
      numberOfLobbyUsers: this.lobbyUsers.length,
    };
  }

  exportInPrivateLobby(): PayloadPrivateLobby {
    return {
      ...this.exportInPublicLobby(),
      lobbyUsers: this.lobbyUsers.map((lobbyUser) => lobbyUser.exportDataToLobby()),
    };
  }

  private addLobbyUserWithLobbyUsersManager(lobbyUserSocket: SocketIO.Socket): void {
    const newLobbyUser = LobbyUsersManager.getInstance().getLobbyUserWithSocketId(
      lobbyUserSocket.id
    );
    if (newLobbyUser !== undefined) {
      this.lobbyUsers.push(newLobbyUser);
      // Add lobbyUser to the private lobby's room (room == socket.io special channel)
      lobbyUserSocket.join(this.socketIORoomName);
      log.info(
        `In lobby with id ${this.id}, lobbyUser with id ${lobbyUserSocket.id} was added`
      );
    } else {
      throw this.errorCantCreateLobbyUserWithLobbyUsersManager(lobbyUserSocket.id);
    }
  }

  private areEveryLobbyUsersReady() {
    return this.lobbyUsers.every(lobbyUser => lobbyUser.isReadyInPrivateLobby)
  }

  private errorLobbyUserIsAlreadyInLobby(lobbyUserId): string {
    return `LobbyUser with id ${lobbyUserId} is already in loby ${this.id}`;
  }

  private errorThisLobbyUserIsNotInsideLobby(lobbyUserId: string): string {
    return `LobbyUser ${lobbyUserId} is not inside`;
  }

  private errorCantCreateLobbyUserWithLobbyUsersManager(socketId: string): string {
    return `Can't create lobbyUser with socket's id ${socketId} with LobbyUsersManager`;
  }
}
