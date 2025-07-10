import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { Customer } from '../entities/customer.entity';

export class CreatedCustomerEvent {
  private readonly logger = new Logger(CreatedCustomerEvent.name);

  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
    private customerQueue: Queue,
  ) {
    this.eventDispatcher.on('customer.created', (data) => {
      this.handleCustomerCreatedEvent(data).catch((err) => {
        this.logger.error(
          "Erro ao lidar com o evento: 'customer.created'",
          err.stack || err,
        );
      });
    });
  }

  async handleCustomerCreatedEvent(data: {
    customer: Customer;
    tenantId: string;
  }) {
    const { customer, tenantId } = data;
    this.logger.debug(
      `Enviando job 'sendNewCustomerNotification' para o cliente '${customer.id}'`,
    );
    const job = await this.customerQueue.add('sendNewCustomerNotification', {
      customer,
      tenantId,
    });

    // this.logger.debug(`Iniciando notificação para o cliente '${customer.id}'`);

    // try {
    //   const tenantConfig =
    //     await this.tenantRepository.getTenantConfig(tenantId);

    //   const template: WhatsappNotificationTemplate | undefined =
    //     tenantConfig?.whatsapp_notification?.[
    //       WhatsappNotificationType.CUSTOMER_NEW
    //     ];

    //   if (!tenantConfig?.whatsapp_config || !template) {
    //     this.logger.warn(
    //       `Configuração de WhatsApp '${WhatsappNotificationType.CUSTOMER_NEW}' não encontrada para tenant ${tenantId}`,
    //     );
    //     return;
    //   }

    //   this.whatsappService.configureForTenant(tenantConfig.whatsapp_config);

    //   const variableValues: Record<string, string> = {
    //     customer_name: customer.name,
    //   };

    //   const renderedMessage = renderTemplate(
    //     template.defaultMessage,
    //     variableValues,
    //   );

    //   await this.whatsappService.sendMessage(renderedMessage, customer.phone);

    //   this.logger.log(
    //     `Mensagem enviada para ${customer.phone} com template ${WhatsappNotificationType.CUSTOMER_NEW}`,
    //   );
    // } catch (error) {
    //   this.logger.error('Erro ao notificar usuário:', error.stack || error);
    // }
  }
}
