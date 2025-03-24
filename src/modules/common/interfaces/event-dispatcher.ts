export const EVENT_DISPATCHER = 'EVENT_DISPATCHER';

export interface EventDispatcher {
  emitAsync(event: string, data: any): Promise<void>;
  on(event: string, listener: (data: any) => void): void;
}
