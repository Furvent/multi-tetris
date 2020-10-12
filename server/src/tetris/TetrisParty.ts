import { IParty } from "../interfaces/IParty";
import { Lobby } from "../lobby/Lobby";
import { TetrisPlayer } from "./TetrisPlayer";
import { ISocketIORoom } from "../interfaces/ISocketIORoom";
import * as events from "../socket/tetris/index";
import log from "../private-module/PrivateLogger";
import {
  TetrisGameData,
  TetrisPublicPlayerGameData,
  BoardPosition,
  BoardDimension,
} from "../../../share/types/tetris/tetrisGameData";
import { IngamePlayer } from "../party/IngamePlayer";
import { TetrominoBlueprint } from "./Tetromino";
import fs from "fs";
import { LobbyUser } from "../lobby/LobbyUser";
import { GenericGameState } from "../party/enum/GameState";
import {
  placeNewTetromino,
  moveTetrominoWithVector,
  checkIfCollisionBetweenPositionsAndBoardBottom,
  checkIfCollisionBetweenPositionsAndPositions,
  determinateNextPositionsWithVector,
  Vector,
} from "./TetrisPartyPositionsUtils";
import { PlayerInput } from "./enums";

/**
 * This class is the Tetris party controller
 */
export class TetrisParty extends IParty implements ISocketIORoom {
  private readonly BOARD_DIMENSION: BoardDimension = {
    width: 10,
    height: 22,
  };
  private readonly TETROMINO_MOVEMENT_TIMER = 500; // milliseconds

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
          new TetrisPlayer(
            player,
            index,
            this.tetrominosConfig,
            this.TETROMINO_MOVEMENT_TIMER
          )
      );
    } else if (config.player) {
      this.players = [];
      this.players.push(
        new TetrisPlayer(
          config.player,
          0,
          this.tetrominosConfig,
          this.TETROMINO_MOVEMENT_TIMER
        )
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
          log.debug(`Player ${player.gameId} create a new tetromino sequence`);
          player.board.createTetrominosSequence();
        }
        // Check if no tetromino on board
        if (player.haveNoTetrominoOnBoard()) {
          log.debug(`Player ${player.gameId} assign new tetromino on board`);
          player.board.assignNewTetrominoOnBoard();
          // Set position
          const newTetromino = player.board.currentTetrominoOnBoard;
          if (!newTetromino) {
            throw "Cannot set new tetromino on board, value is null";
          }
          placeNewTetromino(newTetromino, this.BOARD_DIMENSION);
          newTetromino.launchTimer();
        }
        // check if player input
        if (player.input !== PlayerInput.NONE) {
          this.playerMoveTetromino(player.input, player);
        }

        // check tetromino movement timer
        if (player.board.currentTetrominoOnBoard?.movementTimerEnded()) {
          const nextTetrominoPos = determinateNextPositionsWithVector(
            player.board.currentTetrominoOnBoard.currentPosition,
            { x: 0, y: 1 }
          );
          // If collision
          if (
            this.checkIfTetrominoNextPosHaveCollision(
              nextTetrominoPos,
              player.board.occupiedStaticCells
            )
          ) {
            // We remove current tetromino and push coords to static cells
            player.board.freezeCurrentTetromino();
          } else {
            // Else we move tetromino to the bottom
            moveTetrominoWithVector(player.board.currentTetrominoOnBoard, {
              x: 0,
              y: 1,
            });
            // And launch again timer
            player.board.currentTetrominoOnBoard.launchTimer();
          }
        }
      } catch (error) {
        log.error(
          `Problem in update loop of player with gameId ${player.gameId}: ${error}`
        );
      }
    });
  }

  playerMoveTetromino(playerInput: PlayerInput, player: TetrisPlayer) {
    if (!player.board.currentTetrominoOnBoard) {
      throw `No current tetromino, cannot move it with player's input`;
    }
    let direction: Vector;
    switch (playerInput) {
      case PlayerInput.LEFT:
        direction = { x: -1, y: 0 };
        break;
      case PlayerInput.RIGHT:
        direction = { x: 1, y: 0 };
        break;
      default:
        return;
    }
    const nextTetrominoPos = determinateNextPositionsWithVector(
      player.board.currentTetrominoOnBoard.currentPosition,
      direction
    );

    // If collision, cannot move tetromino
    if (
      !this.checkIfTetrominoNextPosHaveCollision(
        nextTetrominoPos,
        player.board.occupiedStaticCells
      )
    ) {
      moveTetrominoWithVector(player.board.currentTetrominoOnBoard, direction);
    }
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
          events.emitAskClientToLoadGame(player.socket, {
            numberOfPlayer: this.players.length,
            boardDimension: this.BOARD_DIMENSION,
          });
        });
        events.loadTetrisEventsListener(player.socket);
      });
    } catch (error) {
      log.error(`Problem in method initiateGame(): ${error}`);
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
      othersPlayersData: playersGameData.filter(
        (otherPlayer) => otherPlayer.gameId !== player.gameId
      ),
    };
    events.emitTetrisGameData(player.socket, payload);
  }

  private checkIfTetrominoNextPosHaveCollision(
    nextTetrominoPos: BoardPosition[],
    boardOccupiedStaticCells: BoardPosition[]
  ) {
    {
      return (
        checkIfCollisionBetweenPositionsAndBoardBottom(
          nextTetrominoPos,
          this.BOARD_DIMENSION.height
        ) ||
        checkIfCollisionBetweenPositionsAndPositions(
          nextTetrominoPos,
          boardOccupiedStaticCells
        )
      );
    }
  }
}

interface TetrisPartyConfig {
  id: string;
  lobby?: Lobby;
  player?: LobbyUser;
}
