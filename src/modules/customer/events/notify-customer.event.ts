import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';
import { Customer } from '../entities/customer.entity';
import { IWhatsAppService } from 'src/modules/common/interfaces/whatsapp-service';

export class NotifyCustomerEvent {
  constructor(private eventDispatcher: EventDispatcher, private whatsappService: IWhatsAppService) {
    this.eventDispatcher.on('customer.created', (data) =>
      this.handleOrderCreatedEvent(data),
    );
  }

  handleOrderCreatedEvent(payload: Customer) {
    this.whatsappService.sendMessage(`Olá ${payload.name}, você foi adiciona ao Pontuaí`, payload.phone)
    console.log('Notificando usuário: ' + payload.phone);
  }
}
