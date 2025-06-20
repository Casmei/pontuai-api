import { Logger } from '@nestjs/common';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { EntryBalance } from '../entities/entry-balance.entity';

export class PointsExpireIn3DaysEvent {
  private readonly logger = new Logger(PointsExpireIn3DaysEvent.name);

  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('points.expiring-in-3-days', (data) => {
      this.handleOrderCreatedEvent(data).catch((err) => {
        this.logger.error(
          "Erro ao lidar com o evento: 'points.expiring-in-3-days'",
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
        `👀 Ei ${customer.name}, olha só!\n\n` +
        `🎯 Você está pertinho de aproveitar uma recompensa: *${transaction.availablePoints} pontos* seus expiram em *3 dias*.\n\n` +
        `Que tal dar uma passadinha na Sorveteria Amigo para resgatar um prêmio delicioso ou acumular mais uns pontinhos e conquistar algo ainda melhor? 🍦✨\n\n` +
        `🏃‍♂️🏃‍♀️ Vem rapidinho, estamos te esperando com muito sabor e carinho!\n\n` +
        `— Equipe Sorveteria Amigo 💙`;

      await this.whatsappService.sendMessage(message, customer.phone);

      this.logger.log(
        `Mensagem enviada com sucesso para ${customer.name} (${customer.phone})`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para ${customer?.id}:`, error);
    }
  }
}
