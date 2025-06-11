export const EVENT_DISPATCHER = 'EVENT_DISPATCHER'

export interface EventDispatcher {
  //todo: Add a generyc type here
  // biome-ignore lint/suspicious/noExplicitAny: Posso colocar um Generic
  emitAsync(event: string, data: any): Promise<void>
  // biome-ignore lint/suspicious/noExplicitAny: Posso colocar um Generic
  on(event: string, listener: (data: any) => void): void
}
