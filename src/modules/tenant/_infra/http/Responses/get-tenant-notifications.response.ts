import { ApiProperty } from '@nestjs/swagger';
import { WhatsappNotificationType } from 'src/modules/tenant/entities/tenant-config.entity';

class WhatsappNotificationVariable {
  @ApiProperty({
    description: 'Chave da variável usada no template (com chaves)',
    example: '{{customer_name}}',
  })
  key: string;

  @ApiProperty({
    description: 'Descrição do que representa essa variável',
    example: 'Nome do cliente',
  })
  description: string;
}

class WhatsappNotificationTemplate {
  @ApiProperty({
    description: 'Nome do template de notificação',
    example: 'Pontos Adicionados',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição da situação em que o template é usado',
    example:
      'Mensagem enviada quando pontos são adicionados à conta do cliente',
  })
  description: string;

  @ApiProperty({
    description: 'Lista de variáveis disponíveis para interpolação no template',
    type: [WhatsappNotificationVariable],
  })
  variables: WhatsappNotificationVariable[];

  @ApiProperty({
    description:
      'Mensagem padrão com placeholders que será enviada por WhatsApp',
    example:
      'Olá {{customer_name}}, você ganhou {{points_added}} pontos na {{store_name}}!',
  })
  defaultMessage: string;
}

export class WhatsappNotificationMapResponse {
  @ApiProperty({
    description: "Template para 'customer.new'",
    type: WhatsappNotificationTemplate,
    required: false,
  })
  [WhatsappNotificationType.CUSTOMER_NEW]?: WhatsappNotificationTemplate;

  @ApiProperty({
    description: "Template para 'transaction.add_points'",
    type: WhatsappNotificationTemplate,
    required: false,
  })
  [WhatsappNotificationType.TRANSACTION_ADD_POINTS]?: WhatsappNotificationTemplate;

  @ApiProperty({
    description: "Template para 'transaction.redeem_points'",
    type: WhatsappNotificationTemplate,
    required: false,
  })
  [WhatsappNotificationType.TRANSACTION_REDEEM_POINTS]?: WhatsappNotificationTemplate;

  @ApiProperty({
    description: "Template para 'transaction.expire_points_1_days'",
    type: WhatsappNotificationTemplate,
    required: false,
  })
  [WhatsappNotificationType.POINTS_EXPIRING_1_DAYS]?: WhatsappNotificationTemplate;

  @ApiProperty({
    description: "Template para 'transaction.expire_points_3_days'",
    type: WhatsappNotificationTemplate,
    required: false,
  })
  [WhatsappNotificationType.POINTS_EXPIRING_3_DAYS]?: WhatsappNotificationTemplate;

  @ApiProperty({
    description: "Template para 'transaction.expire_points_7_days'",
    type: WhatsappNotificationTemplate,
    required: false,
  })
  [WhatsappNotificationType.POINTS_EXPIRING_7_DAYS]?: WhatsappNotificationTemplate;
}
