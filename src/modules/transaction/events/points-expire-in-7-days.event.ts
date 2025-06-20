import { Logger } from '@nestjs/common';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { EntryBalance } from '../entities/entry-balance.entity';

export class PointsExpireIn7DaysEvent {
  private readonly logger = new Logger(PointsExpireIn7DaysEvent.name);

  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('points.expiring-in-7-days', (data) => {
      this.handleOrderCreatedEvent(data).catch((err) => {
        this.logger.error(
          "Erro ao lidar com o evento: 'points.expiring-in-7-days'",
          err,
        );
      });
    });
  }

  async handleOrderCreatedEvent(data: {
    customer: Customer;
    tenantId: string;
    transaction: EntryBalance;
  }) {
    const { customer, tenantId, transaction } = data;
    this.logger.debug(`Iniciando notificação para o cliente ${customer?.id}`);

    try {
      const tenantConfig =
        await this.tenantRepository.getTenantConfig(tenantId);

      if (!tenantConfig?.whatsapp_config) {
        this.logger.warn(
          `Tenant ${tenantId} não possui configuração do WhatsApp.`,
        );
        return;
      }

      if (!customer.phone) {
        this.logger.warn(
          `Cliente ${customer.id} não possui número de telefone.`,
        );
        return;
      }

      this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

      const message =
        `🔔 Olá ${customer.name}! Temos uma dica importante pra você:\n\n` +
        `📅 Você tem *${transaction.availablePoints} pontos* que irão expirar em *7 dias*.\n` +
        `Use seus pontos antes que eles se percam e aproveite para trocar por prêmios ou descontos na Sorveteria Amigo! 🍦🎁\n\n` +
        `💚 Estamos te esperando!\n` +
        `— Equipe Sorveteria Amigo`;

      await this.whatsappService.sendMessage(message, customer.phone);

      this.logger.log(
        `Mensagem enviada com sucesso para ${customer.name} (${customer.phone})`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para ${customer?.id}:`, error);
    }
  }
}
