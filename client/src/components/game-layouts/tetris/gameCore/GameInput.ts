export class GameInput {
  public catchedEvent = "";
  keyPressedEventListener: EventListener;
  constructor() {
    this.keyPressedEventListener = (event) =>
      this.catchInputEvent(event as KeyboardEvent);
    document.addEventListener("keyup", this.keyPressedEventListener);
  }

  catchInputEvent(event: KeyboardEvent) {
    switch (event.key) {
      case KeyValue.ArrowDown || KeyValue.s:
        this.catchedEvent = KeyboardInputs.DOWN;
        break;
      case KeyValue.ArrowLeft || KeyValue.q:
        this.catchedEvent = KeyboardInputs.LEFT;
        break;
      case KeyValue.ArrowRight || KeyValue.d:
        this.catchedEvent = KeyboardInputs.RIGHT;
        break;
      case KeyValue.ArrowUp || KeyValue.z:
        this.catchedEvent = KeyboardInputs.UP;
        break;

      default:
        break;
    }
  }

  destroy() {
    document.removeEventListener("keyup", this.keyPressedEventListener);
  }
}

export enum KeyboardInputs {
  UP = "UP",
  RIGHT = "RIGHT",
  DOWN = "DOWN",
  LEFT = "LEFT",
}

enum KeyValue {
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  s = "s",
  q = "q",
  d = "d",
  z = "z",
}
