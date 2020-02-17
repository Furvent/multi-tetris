export function logEmit(eventName: string, payload: any = "void") {
  const message = `Emit ${eventName} with payload: `
  console.log(message, payload)
}

export function logListener(eventName: string, payload: any = "void") {
  const message = `Listener ${eventName} was called with payload: `
  console.log(message, payload)
}