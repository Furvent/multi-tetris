const util = require('util') // To inspect objects in node's console
import log from '../private-module/PrivateLogger'

export function logEmit(eventName: string, payload: any, roomChannel?: string) {
  let message = `Emit: ${eventName} with payload: ${util.inspect(payload, false, null, true)}`;
  if (roomChannel) message += ` broadcasted to room ${roomChannel}`
  log.highlight(message)
}