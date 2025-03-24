export const EVENT_DISPATCHER = 'EVENT_DISPATCHER';

export interface EventDispatcher {
  emit(event: string, data: any): void;
}
