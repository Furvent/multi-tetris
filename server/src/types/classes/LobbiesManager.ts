import { Lobby } from "./Lobby";
import { emitUpdatePrivateLobby, emitPublicLobbies } from "../../socket/lobby";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import log from '../../private-module/PrivateLogger'

/**
 * Is singleton
 */
export class LobbiesManager {
  private static instance: LobbiesManager;
  private constructor() {
    this.lobbies = [];
    this.idUsedIncrementator = 0;
  }
  static getInstance(): LobbiesManager {
    if (!LobbiesManager.instance)
      LobbiesManager.instance = new LobbiesManager();
    return LobbiesManager.instance;
  }

  private lobbies: Lobby[];
  private idUsedIncrementator: number;

  // Launch party

  playerJoinLobbyWithId(lobbyId: number, player: SocketIO.Socket): void {
    try {
      this.checkIfPlayerIsInAnotherLobby(player);
      const lobbyToJoin = this.getLobbyWithId(lobbyId);
      if (lobbyToJoin === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      lobbyToJoin.addPlayer(player);
      emitUpdatePrivateLobby(
        lobbyToJoin.exportInPrivateLobby(),
        lobbyToJoin.getSocketRoom()
      );
    } catch (error) {
      log.error(
        `Problem when adding user ${player.id} to lobby with id ${lobbyId}: ${error}`
      );
    }
  }

  playerCreateLobby(player: SocketIO.Socket, roomName: string): void {
    try {
      this.checkIfPlayerIsInAnotherLobby(player);
      const newLobby = new Lobby(
        this.idUsedIncrementator++,
        player.id,
        roomName
      );
      newLobby.addPlayer(player);
      this.lobbies.push(newLobby);
      this.playerAskPublicLobbies(player);
      emitUpdatePrivateLobby(
        newLobby.exportInPrivateLobby(),
        newLobby.getSocketRoom()
      );
    } catch (error) {
      log.error(
        `Problem when player ${player.id} tried to create new lobby: ${error}`
      );
    }
  }

  playerAskPublicLobbies(player: SocketIO.Socket): void {
    emitPublicLobbies(this.exportAllLobbies());
  }

  playerChangeAvailabiltyStatusInPrivateLobby(
    player: SocketIO.Socket,
    lobbyId: number,
    availability: boolean = false
  ) {
    try {
      const lobby = this.getLobbyWithId(lobbyId);
      if (lobby === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      const playerSearched = lobby.getPlayerWithId(player.id);
      if (playerSearched == undefined) {
        throw this.errorPlayerIsNotInThisLobby(player.id, lobbyId);
      }
      playerSearched.isReadyInPrivateLobby = availability;
      emitUpdatePrivateLobby(
        lobby.exportInPrivateLobby(),
        lobby.getSocketRoom()
      );
    } catch (error) {
      log.error(
        `In method playerChangeAvailabiltyStatusInPrivateLobby(), call by player ${player.id} problem: ${error}`
      );
    }
  }

  playerLeavePrivateLobby(player: SocketIO.Socket): void {
    try {
      const playerLobby = this.findPlayerLobby(player);
      if (playerLobby === undefined) {
        throw this.errorPlayerHasNoLobby(player.id);
      }
      this.removePlayerFromLobby(playerLobby, player);
    } catch (error) {
      log.error(
        `Problem when player ${player.id} tried to leave lobby: ${error}`
      );
    }
  }

  playerDeconnectedFromClient(player: SocketIO.Socket): void {
    try {
      const playerLobby = this.findPlayerLobby(player);
      if (playerLobby !== undefined) {
        this.removePlayerFromLobby(playerLobby, player);
      }
    } catch (error) {
      log.error(`Problem when player ${player.id} deconnected: ${error}`);
    }
  }

  private exportAllLobbies(): PayloadPublicLobby[] {
    return this.lobbies.map(lobby => lobby.exportInPublicLobby());
  }

  private getLobbyWithId(id: number): Lobby | undefined {
    const lobbySearched = this.lobbies.find(lobby => lobby.getId() === id);
    return lobbySearched;
  }

  private findPlayerLobby(playerSearched: SocketIO.Socket): Lobby | undefined {
    return this.lobbies.find(lobby => {
      return lobby.players.some(player => player.id === playerSearched.id);
    });
  }

  private checkIfPlayerIsInAnotherLobby(player: SocketIO.Socket) {
    const lobbyAlreadyOccupied = this.findPlayerLobby(player);
    if (lobbyAlreadyOccupied !== undefined) {
      throw this.errorPlayerIsAlreadyInAnotherLobby(
        player.id,
        lobbyAlreadyOccupied.getId()
      );
    }
  }

  private removePlayerFromLobby(
    playerLobby: Lobby,
    player: SocketIO.Socket
  ): void {
    playerLobby.removePlayer(player);
    if (playerLobby.isEmpty()) {
      this.deleteEmptyLobby(playerLobby);
      emitPublicLobbies(this.exportAllLobbies());
    }
    emitUpdatePrivateLobby(
      playerLobby.exportInPrivateLobby(),
      playerLobby.getSocketRoom()
    );
  }

  private deleteEmptyLobby(lobbyToDelete: Lobby) {
    try {
      if (!lobbyToDelete.isEmpty()) {
        throw this.errorCantDeleteLobbyWithPlayerInside(
          lobbyToDelete.getId(),
          lobbyToDelete.players.length
        );
      }
      const lobbyToDeleteIndex = this.lobbies.findIndex(
        lobby => lobby.getId() === lobbyToDelete.getId()
      );
      this.lobbies.splice(lobbyToDeleteIndex, 1);
    } catch (error) {
      log.error(`Problem when trying to delete supposedly empty lobby with id ${lobbyToDelete.getId()}: ${error}`);
    }
  }

  private errorPlayerIsAlreadyInAnotherLobby(
    playerId: string,
    lobbyId: number
  ): string {
    return `Player ${playerId} is already in lobby: ${lobbyId}`;
  }

  private errorNoLobbyWithThatId(id: number): string {
    return `No lobby with id: ${id}`;
  }

  private errorPlayerIsNotInThisLobby(
    playerId: string,
    lobbyId: number
  ): string {
    return `Player ${playerId} is not in lobby: ${lobbyId}`;
  }

  private errorPlayerHasNoLobby(playerId: string): string {
    return `Player ${playerId} has no lobby`;
  }

  private errorCantDeleteLobbyWithPlayerInside(
    lobbyId: number,
    numberOfPlayers: number
  ): string {
    return `Can't delete lobby with id ${lobbyId}, still ${numberOfPlayers} player(s) inside`;
  }
}
