import { PayloadLobbyPlayer } from "../../../../share/types/PayloadLobbyPlayer";

export class Player {
  /**
   * SocketIO.Socket.id
   */
  id: string;
  pseudo: string;
  socket: SocketIO.Socket;
  isReadyInPrivateLobby: boolean;

  constructor(socket: SocketIO.Socket, pseudo) {
    this.id = socket.id;
    this.pseudo = pseudo;
    this.socket = socket;
    this.isReadyInPrivateLobby = false;
    console.log(`New player created. Pseudo: ${this.pseudo}`);
  }

  exportToLobbyPlayer(): PayloadLobbyPlayer {
    return {
      pseudo: this.pseudo,
      isReady: this.isReadyInPrivateLobby,
    };
  }
}
