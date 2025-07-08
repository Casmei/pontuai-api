import { Logger } from '@nestjs/common';
import { renderTemplate } from 'src/_utils/whatsapp-template';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
  WhatsappNotificationTemplate,
  WhatsappNotificationType,
} from 'src/modules/tenant/entities/tenant-config.entity';
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
      this.handlePointsAddedEvent(data).catch((err) => {
        this.logger.error("Erro ao lidar com o evento: 'points.add'", err);
      });
    });
  }

  async handlePointsAddedEvent(data: {
    customer: Customer;
    tenantId: string;
    transaction: Transaction;
    balance: number;
  }) {
    const { customer, tenantId, transaction, balance } = data;
    this.logger.debug(`Iniciando notificação para o cliente '${customer?.id}'`);

    try {
      const tenantConfig =
        await this.tenantRepository.getTenantConfig(tenantId);

      if (!tenantConfig?.whatsapp_config) {
        this.logger.warn(
          `Tenant ${tenantId} não possui configuração do WhatsApp.`,
        );
        return;
      }

      const template: WhatsappNotificationTemplate | undefined =
        tenantConfig?.whatsapp_notification?.[
          WhatsappNotificationType.TRANSACTION_ADD_POINTS
        ];

      if (!template) {
        this.logger.warn(
          `Template '${WhatsappNotificationType.TRANSACTION_ADD_POINTS}' não encontrado para o tenant ${tenantId}`,
        );
        return;
      }

      this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

      const variableValues: Record<string, string> = {
        customer_name: customer.name,
        points_added: transaction.points.toString(),
        total_points: balance.toString(),
      };

      const renderedMessage = renderTemplate(
        template.defaultMessage,
        variableValues,
      );

      await this.whatsappService.sendMessage(renderedMessage, customer.phone);

      this.logger.log(
        `Mensagem enviada com sucesso para ${customer.name} (${customer.phone})`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao enviar mensagem para o cliente ${customer?.id}:`,
        error.stack || error,
      );
    }
  }
}
