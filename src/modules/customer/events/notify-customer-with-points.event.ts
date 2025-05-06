import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';
import { Customer } from '../entities/customer.entity';
import { IWhatsAppService } from 'src/modules/common/interfaces/whatsapp-service';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';

export class NotifyCustomerWithPointsEvent {
  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('customer.created-with-points', async (data) =>
      await this.handleOrderCreatedEvent(data),
    );
  }
  async handleOrderCreatedEvent(data: { customer: Customer, tenantId: string, transaction: Transaction }) {
    try {
      const tenantConfig = await this.tenantRepository.getTenantConfig(data.tenantId);

      if (tenantConfig?.whatsapp_config) {
        this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

        const message =
          `🍨 Olá ${data.customer.name}, bem-vindo ao programa de fidelidade da Sorveteria Amigo!\n` +
          `Você já começou com ${data.transaction.points} pontos 🎉\n\n` +
          `Aqui, cada real gasto vira ponto — e cada ponto te aproxima de prêmios e experiências deliciosas.\n\n` +
          `Continue vindo nos visitar e aproveite as vantagens de ser nosso Amigo 💙\n\n` +
          `— Equipe Sorveteria Amigo`;

        this.whatsappService.sendMessage(message, data.customer.phone);
      }
    } catch (error) {
      console.error('Erro ao notificar usuário:', error);
    }
  }
}
