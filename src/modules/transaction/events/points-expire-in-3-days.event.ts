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
import { EntryBalance } from '../entities/entry-balance.entity';

export class PointsExpireIn3DaysEvent {
  private readonly logger = new Logger(PointsExpireIn3DaysEvent.name);

  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on('points.expiring-in-3-days', (data) => {
      this.handlePointsExpiringEvent(data).catch((err) => {
        this.logger.error(
          "Erro ao lidar com o evento: 'points.expiring-in-3-days'",
          err,
        );
      });
    });
  }

  async handlePointsExpiringEvent(data: {
    customer: Customer;
    tenantId: string;
    transaction: EntryBalance;
  }) {
    const { customer, tenantId, transaction } = data;
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

      if (!customer.phone) {
        this.logger.warn(
          `Cliente ${customer.id} não possui número de telefone.`,
        );
        return;
      }

      const template: WhatsappNotificationTemplate | undefined =
        tenantConfig?.whatsapp_notification?.[
          WhatsappNotificationType.POINTS_EXPIRING_3_DAYS
        ];

      if (!template) {
        this.logger.warn(
          `Template '${WhatsappNotificationType.POINTS_EXPIRING_3_DAYS}' não encontrado para o tenant ${tenantId}`,
        );
        return;
      }

      this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

      const variableValues: Record<string, string> = {
        customer_name: customer.name,
        points_expiring: transaction.availablePoints.toString(),
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
