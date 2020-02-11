import { disconnectEvent } from "./serverEvents";

export default function loadServerEvents(socket: SocketIO.Socket) {
  disconnectEvent(socket);
}
