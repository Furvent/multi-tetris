import { IParty } from "../interfaces/IParty";
import { Lobby } from "../lobby/Lobby";
import { TetrisPlayer } from "./TetrisPlayer";
import { ISocketIORoom } from "../interfaces/ISocketIORoom";
import * as events from "../socket/tetris/index";
import log from "../private-module/PrivateLogger";
import { TetrisPublicPlayerGameData } from "../../../share/types/tetris/tetrisPublicPlayerGameData";
import { TetrisGameData } from "../../../share/types/tetris/tetrisGameData";
import { IngamePlayer } from "../party/IngamePlayer";
import { TetrominoBlueprint } from "./Tetromino";
import fs from "fs";
import { LobbyUser } from "../lobby/LobbyUser";
import { GenericGameState } from "../party/enum/GameState";
import { placeNewTetromino, BoardDimension, moveTetrominoWithVector } from "./TetrisPartyPositionsUtils";

/**
 * This class is the Tetris party controller
 */
export class TetrisParty extends IParty implements ISocketIORoom {

  private readonly BOARD_DIMENSION: BoardDimension = {
    width: 10,
    height: 22,
  }
  private readonly BOARD_HEIGHT = 22;
  private readonly TETROMINO_MOVEMENT_TIMER = 2000; // milliseconds

  id: string;
  socketIORoomName: string;
  players: TetrisPlayer[];
  gameState: GenericGameState;
  private tetrominosConfig: TetrominoBlueprint[];

  constructor(config: TetrisPartyConfig) {
    super();
    if (!config.lobby && !config.player) {
      throw "Can't create new tetris party without lobby or player, there must be one of the two";
    }
    this.id = config.id;
    // Load tetrominos configs
    // TODO to improve: only load one time to global config (at first tetris party launched) to avoid useless memory consumption and file access
    this.tetrominosConfig = JSON.parse(
      fs
        .readFileSync(
          __dirname + "/../../../config/classic-tetrominos-shapes.json"
        )
        .toString()
    );
    if (!this.tetrominosConfig) {
      throw "Can't load tetrominos config";
    }

    // Initiate player(s)
    if (config.lobby) {
      this.players = config.lobby.lobbyUsers.map(
        (player, index) =>
          new TetrisPlayer(player, index, this.tetrominosConfig, this.TETROMINO_MOVEMENT_TIMER)
      );
    } else if (config.player) {
      this.players = [];
      this.players.push(
        new TetrisPlayer(config.player, 0, this.tetrominosConfig, this.TETROMINO_MOVEMENT_TIMER)
      );
    } else {
      this.players = [];
      throw "New party created without player, there is a problem";
    }

    this.socketIORoomName = `party${this.id}`;
    this.connectPlayersSocketsToSocketIORoomAndLoadEventsListener();
    this.gameState = GenericGameState.Loading;
    this.initiateGame();
  }

  connectPlayersSocketsToSocketIORoomAndLoadEventsListener(): void {
    this.players.forEach((player) => {
      player.socket.join(this.socketIORoomName);
      events.loadTetrisEventsListener(player.socket);
    });
  }

  /**
   * Loop called by PartiesManager each server frame only when generic game state is set to running
   */
  updateLoop(): void {
    log.debug(`Update loop called in party with id ${this.id}`);
    this.players.forEach((player) => {
      try {
        // Check if tetromino sequence is empty
        if (player.isTetrominoSequenceEmpty()) {
          player.board.createTetrominosSequence();
        }
        // Check if no tetromino on board
        if (player.haveNoTetrominoOnBoard()) {
          player.board.assignNewTetrominoOnBoard();
          // Set position
          const newTetromino = player.board.currentTetrominoOnBoard;
          if (!newTetromino) {
            throw 'Cannot set new tetromino on board, value is null'
          }
          placeNewTetromino(newTetromino, this.BOARD_DIMENSION)
        }
        // check if player input
        // If input, set tetromino pos
        // check tetromino movement timer
        if (player.board.currentTetrominoOnBoard?.movementTimerEnded()) {
          // Move tetromino to the bottom
          moveTetrominoWithVector(player.board.currentTetrominoOnBoard, {x: 0, y: 1});
          // Reinit timer
          player.board.currentTetrominoOnBoard.launchTimer();
        }
        // check position and collision
          // Collision with board.occupiedStaticCells
          // Collision with board's bottom
      } catch (error) {
        log.error(`Problem in update loop of player with gameId ${player.gameId}: ${error}`)
      }
    });
  }

  /**
   * For each player, emit private and public data game
   */
  sendDataToClients(): void {
    const playersGameData = this.createPlayersGameDataToEmit();
    this.players.forEach((player) => {
      this.sendDataToSocket(player, playersGameData);
    });
  }

  getId(): string {
    return this.id;
  }

  getSocketIORoom(): string {
    return this.socketIORoomName;
  }

  getPlayerWithId(playerSearchedSocketId: string): IngamePlayer | null {
    const playerToFind = this.players.find(
      (player) => player.socket.id === playerSearchedSocketId
    );
    return playerToFind ? playerToFind : null;
  }

  getGameState(): GenericGameState {
    return this.gameState;
  }

  checkIfPartyHasFinishedLoadingAndStartIt(): void {
    if (this.players.every((player) => player.hasLoadedGame)) {
      this.gameState = GenericGameState.Running;
    }
  }

  private initiateGame() {
    try {
      this.players.forEach((player) => {
        // .join is async call, that's why we emit the event to load game only when we are sure socket is in the room
        player.socket.join(this.socketIORoomName, () => {
          events.emitAskClientToLoadGame(player.socket);
        });
        events.loadTetrisEventsListener(player.socket);
      });
    } catch (error) {
      log.error(
        `Problem in method connectPlayersSocketsToSocketIORoomAndLoadEventsListener():${error}`
      );
    }
  }

  checkIfAllPlayersLoadedTheGameAndSetTetrisGameState(): void {
    if (this.players.every((player) => player.hasLoadedGame)) {
      this.gameState = GenericGameState.Running;
    }
  }

  /**
   * Create an array with all public data from each player (positions on board)
   */
  private createPlayersGameDataToEmit(): TetrisPublicPlayerGameData[] {
    return this.players.map((player) => player.exportPublicGameData());
  }

  /**
   * Socket emit his private data and others players public data
   */
  private sendDataToSocket(
    player: TetrisPlayer,
    playersGameData: TetrisPublicPlayerGameData[]
  ): void {
    const payload: TetrisGameData = {
      privateData: player.exportPrivateGameData(),
      otherPlayersData: playersGameData.filter(
        (otherPlayer) => otherPlayer.gameId !== player.gameId
      ),
    };
    events.emitTetrisGameData(player.socket, payload);
  }
}

interface TetrisPartyConfig {
  id: string;
  lobby?: Lobby;
  player?: LobbyUser;
}
