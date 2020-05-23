import { Lobby } from "./Lobby";
import { emitUpdatePrivateLobby, emitPublicLobbies } from "../../socket/lobbies-manager";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import log from "../../private-module/PrivateLogger";
import { PlayersManager } from "./PlayersManager";
import { PartiesManager } from "./party/PartiesManager";

/**
 * Is singleton
 */
export class LobbiesManager {
  private static instance: LobbiesManager;

  private lobbies: Lobby[];
  private idUsedIncrementator: number;

  private constructor() {
    this.lobbies = [];
    this.idUsedIncrementator = 0;
  }
  static getInstance(): LobbiesManager {
    if (!LobbiesManager.instance)
      LobbiesManager.instance = new LobbiesManager();
    return LobbiesManager.instance;
  }

  // Launch party

  playerJoinLobbyWithId(lobbyId: string, player: SocketIO.Socket): void {
    try {
      this.checkIfPlayerIsInAnotherLobby(player);
      const lobbyToJoin = this.getLobbyWithId(lobbyId);
      if (lobbyToJoin === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      lobbyToJoin.addPlayer(player);
      emitUpdatePrivateLobby(
        lobbyToJoin.exportInPrivateLobby(),
        lobbyToJoin.getSocketIORoom()
      );
    } catch (error) {
      log.error(
        `Problem when adding user ${player.id} to lobby with id ${lobbyId}: ${error}`
      );
    }
  }

  playerCreateLobby(player: SocketIO.Socket, roomName?: string): void {
    try {
      this.checkIfPlayerIsInAnotherLobby(player);
      const newLobby = new Lobby(
        (this.idUsedIncrementator++).toString(),
        roomName ? roomName : this.createRoomName(player.id)
      );
      newLobby.addPlayer(player);
      this.lobbies.push(newLobby);
      this.playerAskPublicLobbies(player);
      emitUpdatePrivateLobby(
        newLobby.exportInPrivateLobby(),
        newLobby.getSocketIORoom()
      );
    } catch (error) {
      log.error(
        `Problem when player ${player.id} tried to create new lobby: ${error}`
      );
    }
  }

  playerAskPublicLobbies(player: SocketIO.Socket): void {
    emitPublicLobbies(this.exportAllLobbies(), player);
  }

  playerChangeAvailabiltyStatusInPrivateLobby(
    player: SocketIO.Socket,
    lobbyId: string,
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
        lobby.getSocketIORoom()
      );

      // Launch game
      if (lobby.isGameReadyToLaunch()) {
        PartiesManager.getInstance().addParty(lobby);
      }
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

  /**
   * Just to tests purpose
   */
  getLobbies():Lobby[] | string {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In LobbiesManager, getLobbies called")
        return this.lobbies;
      } else {
        throw this.errorTryingGetAllLobbiesOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
      return "Can't get lobbies just like that you know"
    }
  }

  /**
   * Just to tests purpose
   */
  resetLobbies() {
    try {
      if (process.env.NODE_ENV === "test") {
        log.info("In LobbiesManager, resetLobbies called")
        this.lobbies = [];
      } else {
        throw this.errorTryingResetLobbiesOutsideTestEnv();
      }
    } catch (error) {
      log.error(error);
    }
  }

  private exportAllLobbies(): PayloadPublicLobby[] {
    return this.lobbies.map(lobby => lobby.exportInPublicLobby());
  }

  private getLobbyWithId(id: string): Lobby | undefined {
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
    playerSocket: SocketIO.Socket
  ): void {
    // TODO: implement try catch
    const player = PlayersManager.getInstance().getPlayerWithSocketId(playerSocket.id);
    if (player) {
      player.isReadyInPrivateLobby = false;
    }
    playerLobby.removePlayer(playerSocket);
    if (playerLobby.isEmpty()) {
      this.deleteEmptyLobby(playerLobby);
    }
    emitPublicLobbies(this.exportAllLobbies());
    emitUpdatePrivateLobby(
      playerLobby.exportInPrivateLobby(),
      playerLobby.getSocketIORoom()
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
      log.error(
        `Problem when trying to delete supposedly empty lobby with id ${lobbyToDelete.getId()}: ${error}`
      );
    }
  }

  private createRoomName(playerId: string): string {
    const playerPseudo = PlayersManager.getInstance().getPlayerWithSocketId(
      playerId
    )?.pseudo;
    return playerPseudo ? `${playerPseudo}'s room` : `room ${this.idUsedIncrementator}`;
  }

  private errorPlayerIsAlreadyInAnotherLobby(
    playerId: string,
    lobbyId: string
  ): string {
    return `Player ${playerId} is already in lobby: ${lobbyId}`;
  }

  private errorNoLobbyWithThatId(id: string): string {
    return `No lobby with id: ${id}`;
  }

  private errorPlayerIsNotInThisLobby(
    playerId: string,
    lobbyId: string
  ): string {
    return `Player ${playerId} is not in lobby: ${lobbyId}`;
  }

  private errorPlayerHasNoLobby(playerId: string): string {
    return `Player ${playerId} has no lobby`;
  }

  private errorCantDeleteLobbyWithPlayerInside(
    lobbyId: string,
    numberOfPlayers: number
  ): string {
    return `Can't delete lobby with id ${lobbyId}, still ${numberOfPlayers} player(s) inside`;
  }

  private errorTryingResetLobbiesOutsideTestEnv(): string {
    return `WARNING: something try to reset lobbies outside test env`
  }

  private errorTryingGetAllLobbiesOutsideTestEnv(): string {
    return `WARNING: something try to get all lobbies outside test env`
  }
}
