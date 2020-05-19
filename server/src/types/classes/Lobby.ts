import { IRoom } from "../interfaces/IRoom";
import { Player } from "./Player";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";
import { PlayersManager } from "./PlayersManager";
import log from "../../private-module/PrivateLogger";

export class Lobby implements IRoom {
  players: Player[];
  private id: number;
  private roomName: string;
  // socketIORoomName == socket.io special channel's name
  private socketIORoomName: string;
  private inChargePlayerId: string;

  constructor(id: number, creatorId: string, roomName: string) {
    this.id = id;
    this.socketIORoomName = `room${this.id}`;
    this.roomName = roomName;
    this.players = [];
    this.inChargePlayerId = creatorId;
    log.info(
      `New lobby is created by user ${creatorId}, with id ${id}. SocketRoomName: ${this.socketIORoomName}, roomName: ${this.roomName}`
    );
  }

  isFull(): boolean {
    return this.players.length >= 4;
  }

  isEmpty(): boolean {
    return this.players.length <= 0;
  }

  getId(): number {
    return this.id;
  }

  getSocketIORoom(): string {
    return this.socketIORoomName;
  }

  addPlayer(player: SocketIO.Socket): void {
    try {
      if (this.getPlayerWithId(player.id) !== undefined)
        throw this.errorPlayerIsAlreadyInLobby(player.id);
      else {
        this.addPlayerWithPlayersManager(player);
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
    return this.players.find((player) => player.id == id);
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
        `In lobby with id ${this.id}, player ${playerSocket.id} was added to lobby ${this.id}`
      );
    } else {
      throw this.errorCantCreatePlayerWithPlayersManager(playerSocket.id)
    }
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
