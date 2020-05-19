import { playerEventsListener } from "./playerEvents";

export function loadPlayerEventsListener(socket: SocketIO.Socket) {
  playerEventsListener(socket);
}