import { Logger } from '@nestjs/common';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { Transaction } from '../entities/transaction.entity';

export class PointsAddEvent {
  private readonly logger = new Logger(PointsAddEvent.name);

  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('points.add', (data) => {
      this.handleOrderCreatedEvent(data).catch((err) => {
        this.logger.error("Erro ao lidar com o evento: 'points.add'", err);
      });
    });
  }

  async handleOrderCreatedEvent(data: {
    customer: Customer;
    tenantId: string;
    transaction: Transaction;
    balance: number;
  }) {
    const { customer, tenantId, transaction, balance } = data;
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
        `🍦 Parabéns, ${customer.name}! Você ganhou *${transaction.points} pontos* na Sorveteria Amigo 🎉\n\n` +
        `Agora você tem *${balance} pontos acumulados*! 🙌\n` +
        `Junte mais e venha trocar por prêmios — na loja ou pelo delivery 🛵💚`;

      await this.whatsappService.sendMessage(message, customer.phone);

      this.logger.log(
        `Mensagem enviada com sucesso para ${customer.name} (${customer.phone})`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para ${customer?.id}:`, error);
    }
  }
}
