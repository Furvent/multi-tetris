export class GameTimer {
  private duration: number; // milliseconds
  private _isOver = false;
  private setTimeoutController: NodeJS.Timeout | null;

  constructor(duration: number, wantStartAtCreation: boolean = false) {
    this.duration = duration;
    this.setTimeoutController = null;
    if (wantStartAtCreation) {
      this.launch();
    }
  }

  get isOver(): boolean {
    return this._isOver;
  }

  public launch(): void {
    this.cleanTimer();
    this.setTimeoutController = setTimeout(
      () => (this._isOver = true),
      this.duration
    );
  }

  public setNewDuration(duration: number): void {
    this.duration = duration;
  }

  private cleanTimer(): void {
    this._isOver = false;
    if (this.setTimeoutController) {
      clearTimeout(this.setTimeoutController);
    }
  }
}
