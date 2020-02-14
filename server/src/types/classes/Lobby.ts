import { IRoom } from "../interfaces/IRoom";
import { Player } from "./Player";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";

export class Lobby implements IRoom {
  players: Player[];
  private id: number;
  private roomName: string;
  // room == socket.io special channel
  private socketRoomName: string;
  private creatorId: string;

  constructor(id: number, creatorId: string, roomName: string) {
    this.id = id;
    this.socketRoomName = `room${this.id}`;
    this.roomName = roomName;
    this.players = [];
    this.creatorId = creatorId;
    console.log(
      `New lobby is created by user ${creatorId}, with id ${id}. SocketRoomName: ${this.socketRoomName}, roomName: ${this.roomName}`
    );
  }

  isFull(): boolean {
    return this.players.length >= 4
  }

  getId(): number {
    return this.id;
  }

  getSocketRoom(): string {
    return this.socketRoomName;
  }

  addPlayer(socket: SocketIO.Socket) {
    try {
      if (this.getPlayerWithId(socket.id) !== null)
        throw `Player with id ${socket.id} is already in loby ${this.id}`;
      else {
        const newPlayer = new Player(socket);
        this.players.push(newPlayer);
        // Add player to the private lobby's room (room == socket.io special channel)
        socket.join(this.socketRoomName);
        console.log(
          `Player ${socket.id} was added to lobby ${this.id}`
        );
      }
    } catch (error) {
      console.error(`Problem when trying to create a new player: ${error}`);
    }
  }

  getPlayerWithId(id: string): Player | null {
    this.players.forEach(player => {
      if ((player.id = id)) return player;
    });
    return null;
  }

  exportInPublicLobby(): PayloadPublicLobby {
    return {
      id: this.id,
      isFull: this.isFull(),
      name: this.roomName
    };
  }

  exportInPrivateLobby(): PayloadPrivateLobby {
    return {
      ...this.exportInPublicLobby(),
      players: this.players.map(player => player.exportToLobbyPlayer())
    };
  }
}
