import { loadBasicEvents } from "./basics";

export function loadEvents(socket: SocketIO.Socket) {
  loadBasicEvents(socket);
}
