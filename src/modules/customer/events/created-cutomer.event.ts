import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { Customer } from '../entities/customer.entity';
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';

export class CreatedCustomerEvent {
  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('customer.created', (data) => {
      this.handleOrderCreatedEvent(data).catch((err) => {
        console.error(
          "Erro ao lidar com o evento: 'customer.created-with-points'",
          err,
        );
      });
    });
  }
  async handleOrderCreatedEvent(data: {
    customer: Customer;
    tenantId: string;
  }) {
    try {
      const tenantConfig = await this.tenantRepository.getTenantConfig(
        data.tenantId,
      );

      if (tenantConfig?.whatsapp_config) {
        this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

        const message =
          `🍦 Olá ${data.customer.name}, que alegria ter você com a gente! 💚\n\n` +
          `Você agora faz parte do nosso programa de fidelidade *Amigo*, onde cada visita te aproxima de prêmios e experiências deliciosas! 😋\n\n` +
          `Estamos te esperando na loja ou no delivery para começar essa amizade cheia de sabor 🛵🍨\n\n` +
          `— Equipe Sorveteria Amigo`;

        await this.whatsappService.sendMessage(message, data.customer.phone);
      }
    } catch (error) {
      console.error('Erro ao notificar usuário:', error);
    }
  }
}
