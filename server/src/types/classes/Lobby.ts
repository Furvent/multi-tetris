import { IRoom } from "../interfaces/IRoom";
import { Player } from "./Player";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";

export class Lobby implements IRoom {
  players: Player[];
  private id: number;
  private roomName: string;
  // socketRoomName == socket.io special channel's name
  private socketRoomName: string;
  private inChargePlayerId: string;

  constructor(id: number, creatorId: string, roomName: string) {
    this.id = id;
    this.socketRoomName = `room${this.id}`;
    this.roomName = roomName;
    this.players = [];
    this.inChargePlayerId = creatorId;
    console.log(
      `New lobby is created by user ${creatorId}, with id ${id}. SocketRoomName: ${this.socketRoomName}, roomName: ${this.roomName}`
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

  getSocketRoom(): string {
    return this.socketRoomName;
  }

  addPlayer(player: SocketIO.Socket): void {
    try {
      if (this.getPlayerWithId(player.id) !== undefined)
        throw this.errorPlayerIsAlreadyInLobby(player.id);
      else {
        const newPlayer = new Player(player);
        this.players.push(newPlayer);
        // Add player to the private lobby's room (room == socket.io special channel)
        player.join(this.socketRoomName);
        console.log(
          `In lobby with id ${this.id}, player ${player.id} was added to lobby ${this.id}`
        );
      }
    } catch (error) {
      console.error(
        `In lobby with id ${this.id}, problem when trying to create a new player: ${error}`
      );
    }
  }

  removePlayer(playerToRemove: SocketIO.Socket): void {
    try {
      const playerIndex = this.players.findIndex(
        player => player.id === playerToRemove.id
      );
      if (playerIndex === -1) {
        throw this.errorThisPlayerIsNotInsideLobby(playerToRemove.id);
      }
      this.players.splice(playerIndex, 1);
      playerToRemove.leave(this.socketRoomName)
    } catch (error) {
      console.error(
        `In lobby with id ${this.id}, problem when trying to delete a player: ${error}`
      );
    }
  }

  getPlayerWithId(id: string): Player | undefined {
    return this.players.find(player => player.id == id);
  }

  exportInPublicLobby(): PayloadPublicLobby {
    return {
      id: this.id,
      isFull: this.isFull(),
      name: this.roomName,
      numberOfPlayers: this.players.length
    };
  }

  exportInPrivateLobby(): PayloadPrivateLobby {
    return {
      ...this.exportInPublicLobby(),
      players: this.players.map(player => player.exportToLobbyPlayer())
    };
  }

  private errorPlayerIsAlreadyInLobby(playerId): string {
    return `Player with id ${playerId} is already in loby ${this.id}`;
  }

  private errorThisPlayerIsNotInsideLobby(playerId: string): string {
    return `Player ${playerId} is not inside`;
  }
}
