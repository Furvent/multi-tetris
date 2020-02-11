import { Lobby } from "./Lobby";

/**
 * Is singleton
 */
export class LobbiesManager {
  private static instance: LobbiesManager;
  private constructor() {
    this.idUsedIncrementator = 0;
  }
  static getInstance(): LobbiesManager {
    if (!LobbiesManager.instance)
      LobbiesManager.instance = new LobbiesManager();
    return LobbiesManager.instance;
  }

  private lobbies: Lobby[];
  idUsedIncrementator: number;

  deleteLobbyWithId(id: number) {
    try {
      const index = this.lobbies.findIndex(lobby => lobby.getId() === id);
      if (index === -1) throw("No Lobby with that id")
      this.lobbies.splice(index, 1);
    } catch (error) {
        console.error(`Problem when trying to delete lobby with id ${id}: ${error}`)
    }
  }

  userJoinLobbyWithId(id: number, socket: SocketIO.Socket) {

  }

  userCreateLobby(creator: SocketIO.Socket) {
    const newLobby = new Lobby(this.idUsedIncrementator++, creator)
    this.lobbies.push(newLobby)
  }
}
