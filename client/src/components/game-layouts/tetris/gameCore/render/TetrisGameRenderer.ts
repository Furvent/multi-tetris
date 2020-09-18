import { BoardDimension } from "../../../../../../../share/types/tetris/tetrisGameData";

export class TetrisGameRenderer {
  private ctx: CanvasRenderingContext2D;
  private numberOfPlayers: number;
  private playersBoardsTopLeftAnchors: PlayerBoardTopLeftAnchor[];
  /**
   * Pixel, generate at instantiation
   */
  private readonly BOARD_WIDTH: number;
  private readonly PLAYING_FIELD_HEIGHT: number; // playing field is where tetromino and static cells are displayed
  /**
   * In Pixel, maybe in a config file in futur
   */
  private readonly CELL_PIXEL_SIZE = 15;
  private readonly MARGIN_X = 25;
  private readonly MARGIN_Y = 25;
  private readonly HEADER_HEIGHT = 100;
  private readonly FOOTER_HEIGHT = 200;
  private readonly BORDER_BOARD_THICK = 3;

  private readonly COLOR_BORDER_BOARD = "#333333";
  private readonly COLOR_CELL_OCCUPIED = "#00FF00";
  private readonly COLOR_TEXT_HEADER = "#FF0000";
  private readonly COLOR_TEXT_FOOTER = "#0000FF";

  constructor(
    ctx: CanvasRenderingContext2D,
    boardDimension: BoardDimension,
    numberOfPlayers: number
  ) {
    if (!ctx) throw `In TetrisGameRenderer, no ctx provided`;
    if (!boardDimension) throw `In TetrisGameRenderer, no board dimension provided`
    if (!numberOfPlayers) throw `In TetrisGameRenderer, no number of players provided`
    this.numberOfPlayers = numberOfPlayers;
    this.ctx = ctx;
    this.playersBoardsTopLeftAnchors = this.determinateTopLeftAnchors();
    this.BOARD_WIDTH = Math.round(this.CELL_PIXEL_SIZE * boardDimension.width);
    this.PLAYING_FIELD_HEIGHT = Math.round(
      this.CELL_PIXEL_SIZE * boardDimension.height
    );
  }

  public draw(
    localPlayerDataToDraw: LocalPlayerDataToDraw,
    othersPlayersDataToDraw: CommonPlayerBoardDataToDraw[]
  ) {
    try {
      // Local player grid is always at the left
      this.drawLocalPlayerGrid(localPlayerDataToDraw);
      if (this.numberOfPlayers > 1) {
        this.drawOthersPlayersGrids(othersPlayersDataToDraw);
      }
    } catch (error) {
      `Error on render: ${error}`;
    }
  }

  private determinateTopLeftAnchors(): PlayerBoardTopLeftAnchor[] {
    const topLeftAnchorsList: PlayerBoardTopLeftAnchor[] = [];
    for (let index = 0; index < this.numberOfPlayers; index++) {
      topLeftAnchorsList.push({
        anchorPositionOrder: index + 1,
        topLeftAnchor: {
          x: this.MARGIN_X + index * (this.BOARD_WIDTH + this.MARGIN_X),
          y: this.MARGIN_Y,
        },
      });
    }
    return topLeftAnchorsList;
  }

  private drawLocalPlayerGrid(data: LocalPlayerDataToDraw): void {
    // Local player always draw at the left
    const anchor = this.getAnchorByPositionOrder(1);
    if (!anchor)
      throw "No anchor found to local player in drawLocalPlayerGrid()";
    this.drawHeader(anchor, data.pseudo);
    this.drawPlayingField(anchor, data.staticCells, data.currentTetrominoCells);
    this.drawFooter(anchor, data.debugMessage);
  }

  private drawOthersPlayersGrids(data: CommonPlayerBoardDataToDraw[]): void {
    data.forEach((boardData, index) => {
      const playerBoardAnchor = this.getAnchorByPositionOrder(index + 2);
      if (!playerBoardAnchor) {
        throw `In drawOthersPlayersGrids(), no player board anchor at position ${index +
          2}`;
      }
      this.drawOtherPlayer(boardData, playerBoardAnchor);
    });
  }

  drawOtherPlayer(
    boardData: CommonPlayerBoardDataToDraw,
    anchor: CanvasPosition
  ): void {
    this.drawHeader(anchor, boardData.pseudo);
    this.drawPlayingField(anchor, boardData.staticCells, boardData.currentTetrominoCells);
    this.drawFooter(anchor);
  }

  private drawHeader(anchor: CanvasPosition, pseudo: string): void {
    this.ctx.fillStyle = this.COLOR_BORDER_BOARD;
    this.ctx.strokeRect(
      anchor.x,
      anchor.y,
      this.BOARD_WIDTH,
      this.HEADER_HEIGHT
    );
    // Write pseudo at middle
    this.ctx.fillStyle = this.COLOR_TEXT_HEADER;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      pseudo,
      Math.round(anchor.x + this.BOARD_WIDTH / 2), // X pos on canvas
      Math.round(anchor.y + this.HEADER_HEIGHT / 2) // Y pos on canvas
    );
  }

  private drawPlayingField(
    anchor: CanvasPosition,
    staticCells: BoardPosition[],
    tetromino: BoardPosition[]
  ): void {
    const playingFieldAnchor: CanvasPosition = {
      x: anchor.x,
      y: anchor.y + this.HEADER_HEIGHT,
    };
    // Draw border
    this.ctx.fillStyle = this.COLOR_BORDER_BOARD;
    this.ctx.strokeRect(
      playingFieldAnchor.x,
      playingFieldAnchor.y,
      this.BOARD_WIDTH,
      this.PLAYING_FIELD_HEIGHT
    );
    // Draw occupied cell:
    this.ctx.fillStyle = this.COLOR_CELL_OCCUPIED;
    // Draw in same color tetromino and static cells
    const cellsToColor = tetromino.concat(staticCells);
    cellsToColor.forEach((cell) => {
      const cellPosOnCanvas = this.translatePosFromBoardCellToCanvasPixel(
        cell,
        playingFieldAnchor
      );
      this.ctx.fillRect(
        cellPosOnCanvas.x,
        cellPosOnCanvas.y,
        this.CELL_PIXEL_SIZE,
        this.CELL_PIXEL_SIZE
      );
    });
  }

  private drawFooter(
    anchor: CanvasPosition,
    debugMessage = "no data for now"
  ): void {
    const footerAnchor = {
      x: anchor.x,
      y: anchor.y + this.HEADER_HEIGHT + this.PLAYING_FIELD_HEIGHT,
    };
    this.ctx.fillStyle = this.COLOR_BORDER_BOARD;
    this.ctx.strokeRect(
      footerAnchor.x,
      footerAnchor.y,
      this.BOARD_WIDTH,
      this.FOOTER_HEIGHT
    );
    this.ctx.fillStyle = this.COLOR_TEXT_FOOTER;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      debugMessage,
      Math.round(footerAnchor.x + this.BOARD_WIDTH / 2), // X pos on canvas
      Math.round(footerAnchor.y + this.FOOTER_HEIGHT / 2) // Y pos on canvas
    );
  }

  private getAnchorByPositionOrder(
    positionOrder: number
  ): CanvasPosition | null {
    const anchor = this.playersBoardsTopLeftAnchors.find(
      (anchorData) => anchorData.anchorPositionOrder === positionOrder
    );
    if (!anchor) return null;
    else return anchor.topLeftAnchor;
  }

  private translatePosFromBoardCellToCanvasPixel(
    boardPos: BoardPosition,
    topLeftAnchor: CanvasPosition
  ): CanvasPosition {
    return {
      x: topLeftAnchor.x + this.CELL_PIXEL_SIZE * (boardPos.x - 1),
      y: topLeftAnchor.y + this.CELL_PIXEL_SIZE * (boardPos.y - 1),
    };
  }
}

type PlayerBoardTopLeftAnchor = {
  anchorPositionOrder: number;
  topLeftAnchor: CanvasPosition;
};

/**
 * In pixels, relative position from canvas origin (0, 0)
 * It's the top left origin position
 */
type CanvasPosition = {
  x: number;
  y: number;
};

/**
 * Cell position on board
 */
type BoardPosition = {
  x: number;
  y: number;
};

export interface LocalPlayerDataToDraw extends CommonPlayerBoardDataToDraw {
  debugMessage: string;
};

export interface CommonPlayerBoardDataToDraw {
  staticCells: BoardPosition[];
  currentTetrominoCells: BoardPosition[];
  pseudo: string;
};
