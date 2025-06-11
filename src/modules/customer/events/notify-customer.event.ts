import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher'
import { Customer } from '../entities/customer.entity'
import { IWhatsAppService } from 'src/modules/@shared/interfaces/whatsapp-service'
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository'

export class NotifyCustomerEvent {
  constructor(
    private eventDispatcher: EventDispatcher,
    private whatsappService: IWhatsAppService,
    private tenantRepository: ITenantRepository,
  ) {
    this.eventDispatcher.on(
      'customer.created',
      async (data) => await this.handleOrderCreatedEvent(data),
    )
  }
  async handleOrderCreatedEvent(data: {
    customer: Customer
    tenantId: string
  }) {
    try {
      const tenantConfig = await this.tenantRepository.getTenantConfig(
        data.tenantId,
      )

      if (tenantConfig?.whatsapp_config) {
        this.whatsappService.configureForTenant(tenantConfig.whatsapp_config)

        this.whatsappService.sendMessage(
          `🍦 Olá ${data.customer.name}, que alegria ter você aqui!\n` +
            `Você agora faz parte do nosso programa de fidelidade Amigo — onde cada visita é um passo a mais nessa amizade deliciosa.\n\n` +
            `A cada compra, você acumula pontos que podem ser trocados por prêmios incríveis.\n` +
            `Estamos te esperando para começar a pontuar! 💙\n\n` +
            `— Equipe Sorveteria Amigo`,
          data.customer.phone,
        )
      }
    } catch (error) {
      console.error('Erro ao notificar usuário:', error)
    }
  }
}
