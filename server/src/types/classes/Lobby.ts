import { Player } from "./Player";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";
import { PlayersManager } from "./PlayersManager";
import log from "../../private-module/PrivateLogger";
import { ISocketIORoom } from "../interfaces/ISocketIORoom";

/**
 * NOTE : C'est dans cette classe que devrait être stocké le fait que les joueurs sont prêts, et non pas dans la classe Player.
 */
export class Lobby implements ISocketIORoom {
  readonly MAX_PLAYER = 2

  players: Player[];
  private id: string;
  private roomName: string;
  // socketIORoomName == socket.io special channel's name
  private socketIORoomName: string;
  // TODO: Meilleur implémentation (attribuer à la création le type de lobby)
  lobbyType = "tetris";

  constructor(id: string, roomName: string) {
    this.players = [];
    this.id = id;
    this.socketIORoomName = `room${this.id}`;
    this.roomName = roomName;
    log.info(
      `New lobby is created with id ${id}. SocketIORoomName: ${this.socketIORoomName}, roomName: ${this.roomName}`
    );
  }

  isFull(): boolean {
    return this.players.length >= this.MAX_PLAYER;
  }

  isEmpty(): boolean {
    return this.players.length <= 0;
  }

  getId(): string {
    return this.id;
  }

  getSocketIORoom(): string {
    return this.socketIORoomName;
  }

  addPlayer(socket: SocketIO.Socket): void {
    try {
      if (this.getPlayerWithId(socket.id) !== undefined)
        throw this.errorPlayerIsAlreadyInLobby(socket.id);
      else {
        this.addPlayerWithPlayersManager(socket);
      }
    } catch (error) {
      log.error(
        `In lobby with id ${this.id}, problem when trying to create a new player: ${error}`
      );
    }
  }

  removePlayer(playerToRemove: SocketIO.Socket): void {
    try {
      const playerIndex = this.players.findIndex(
        (player) => player.id === playerToRemove.id
      );
      if (playerIndex === -1) {
        throw this.errorThisPlayerIsNotInsideLobby(playerToRemove.id);
      }
      this.players.splice(playerIndex, 1);
      playerToRemove.leave(this.socketIORoomName);
    } catch (error) {
      log.error(
        `In lobby with id ${this.id}, problem when trying to delete a player: ${error}`
      );
    }
  }

  getPlayerWithId(id: string): Player | undefined {
    return this.players.find((player) => player.id === id);
  }

  isGameReadyToLaunch(): boolean {
    return this.isFull() && this.areEveryPlayersReady();
  }

  createPartyFromLobby() {

  }

  exportInPublicLobby(): PayloadPublicLobby {
    return {
      id: this.id,
      isFull: this.isFull(),
      name: this.roomName,
      numberOfPlayers: this.players.length,
    };
  }

  exportInPrivateLobby(): PayloadPrivateLobby {
    return {
      ...this.exportInPublicLobby(),
      players: this.players.map((player) => player.exportToLobbyPlayer()),
    };
  }

  private addPlayerWithPlayersManager(playerSocket: SocketIO.Socket): void {
    const newPlayer = PlayersManager.getInstance().getPlayerWithSocketId(
      playerSocket.id
    );
    if (newPlayer !== undefined) {
      this.players.push(newPlayer);
      // Add player to the private lobby's room (room == socket.io special channel)
      playerSocket.join(this.socketIORoomName);
      log.info(
        `In lobby with id ${this.id}, player with id ${playerSocket.id} was added`
      );
    } else {
      throw this.errorCantCreatePlayerWithPlayersManager(playerSocket.id);
    }
  }

  private areEveryPlayersReady() {
    return this.players.every(player => player.isReadyInPrivateLobby)
  }

  private errorPlayerIsAlreadyInLobby(playerId): string {
    return `Player with id ${playerId} is already in loby ${this.id}`;
  }

  private errorThisPlayerIsNotInsideLobby(playerId: string): string {
    return `Player ${playerId} is not inside`;
  }

  private errorCantCreatePlayerWithPlayersManager(socketId: string): string {
    return `Can't create player with socket's id ${socketId} with PlayersManager`;
  }
}
