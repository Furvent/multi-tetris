import { PayloadLobbyUser } from "../../../share/types/PayloadLobbyUser";

export class LobbyUser {
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
    console.log(`New lobbyUser created. Pseudo: ${this.pseudo}`);
  }

  exportDataToLobby(): PayloadLobbyUser {
    return {
      pseudo: this.pseudo,
      isReady: this.isReadyInPrivateLobby,
    };
  }
}
