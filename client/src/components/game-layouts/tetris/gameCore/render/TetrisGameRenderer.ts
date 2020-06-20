export class TetrisGameRenderer {
  private ctx: CanvasRenderingContext2D;
  private numberOfplayers: number;

  constructor(ctx: CanvasRenderingContext2D, numberOfplayers: number) {
    this.numberOfplayers = numberOfplayers;
    this.ctx = ctx;
  }

  public draw() {}
}

enum TetrisGridLayout {
  BoardWidth = 300,
  MarginX = 25,
  MarginY = 25,
  HeaderWidth = BoardWidth,
  HeaderHeight = 100,
  FooterWidth = BoardWidth,
  FooterHeight = 200,
  PlayingFieldWidth = BoardWidth,
  PlayingFieldHeigth = 600
}
