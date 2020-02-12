import { IRoom } from "../interfaces/IRoom";
import { Player } from "./Player";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";

export class Lobby implements IRoom {
  players: Player[];
  private id: number;
  // Later, player will have the possibility to change it
  private roomName: string
  // room == socket.io special channel
  private socketRoomName: string;

  constructor(id: number, creator: SocketIO.Socket) {
    this.id = id;
    this.socketRoomName = `room${this.id}`
    console.log(`New lobby is created by user ${creator.id}, with id ${id}`)
    this.addPlayer(creator);
  }

  isFull(): boolean {
    throw new Error("Method not implemented.");
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
        throw `Player with id ${socket.id} is already in loby with id ${this.id}`;
      else {
        const newPlayer = new Player(socket);
        this.players.push(newPlayer);
        // Add player to the private lobby's room (room == socket.io special channel)
        socket.join(this.socketRoomName)
        console.log(`Player ${socket.id} was added to lobby with id ${this.id}`)
      }
    } catch (error) {
        console.error(`Problem when trying to create a new player: ${error}`)
    }
  }

  getPlayerWithId(id: string): Player {
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
    }
  }

  exportInPrivateLobby(): PayloadPrivateLobby {
    return {
      ...this.exportInPublicLobby(),
      socketRoomName: this.socketRoomName,
      players: this.players.map(player => player.exportToLobbyPlayer())
    }
  }
}
