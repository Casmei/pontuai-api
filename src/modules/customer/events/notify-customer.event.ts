import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';
import { Customer } from '../entities/customer.entity';
import { IWhatsAppService } from 'src/modules/common/interfaces/whatsapp-service';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';

export class NotifyCustomerEvent {
  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('customer.created', async (data) =>
      await this.handleOrderCreatedEvent(data),
    );
  }
  async handleOrderCreatedEvent(data: { customer: Customer, tenantId: string }) {
    try {
      const tenantConfig = await this.tenantRepository.getTenantConfig(data.tenantId);

      if (tenantConfig?.whatsapp_config) {
        this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

        this.whatsappService.sendMessage(
          `Olá ${data.customer.name}, você foi adicionado ao Pontuaí`,
          data.customer.phone
        );
      }
    } catch (error) {
      console.error('Erro ao notificar usuário:', error);
    }
  }
}
