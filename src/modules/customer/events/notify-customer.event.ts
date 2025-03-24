import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';
import { Customer } from '../entities/customer.entity';

export class NotifyCustomerEvent {
  constructor(private eventDispatcher: EventDispatcher) {
    this.eventDispatcher.on('customer.created', (data) =>
      this.handleOrderCreatedEvent(data),
    );
  }
  handleOrderCreatedEvent(payload: Customer) {
    console.log('Notificando usuário: ' + payload.phone);
  }
}
