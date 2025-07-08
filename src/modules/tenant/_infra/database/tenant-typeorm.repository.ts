import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import { Repository } from 'typeorm';
import {
  PointConfig,
  TenantConfig,
  WhatsappNotificationMap,
  WhatsappNotificationType,
} from '../../entities/tenant-config.entity';
import { TenantUser, UserTenantRole } from '../../entities/tenant-user.entity';
import { Tenant } from '../../entities/tenant.entity';
import { ITenantRepository } from '../../interfaces/tenant.repository';
import CreateTenantDto from '../http/Dtos/create-tenant.dto';
import { UpdateTenantNotificationsDto } from '../http/Dtos/update-tenant-notifications.dto';
import { UpdateTenantSettingsDto } from '../http/Dtos/update-tenant-settings.dto';

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantUser)
    private tenantUserRepository: Repository<TenantUser>,
    @InjectRepository(TenantConfig)
    private tenantConfigRepository: Repository<TenantConfig>,
  ) {}

  async updateNotifications(
    tenantId: string,
    data: UpdateTenantNotificationsDto,
  ): Promise<void> {
    try {
      const tenantConfig = await this.getTenantConfig(tenantId);
      const updatedNotifications = { ...tenantConfig?.whatsapp_notification };

      const dtoKeyToNotificationTypeMap: Record<
        keyof UpdateTenantNotificationsDto,
        WhatsappNotificationType
      > = {
        customerNew: WhatsappNotificationType.CUSTOMER_NEW,
        transactionAddPoints: WhatsappNotificationType.TRANSACTION_ADD_POINTS,
        transactionRedeemPoints:
          WhatsappNotificationType.TRANSACTION_REDEEM_POINTS,
        transactionExpirePoints1Days:
          WhatsappNotificationType.POINTS_EXPIRING_1_DAYS,
        transactionExpirePoints3Days:
          WhatsappNotificationType.POINTS_EXPIRING_3_DAYS,
        transactionExpirePoints7Days:
          WhatsappNotificationType.POINTS_EXPIRING_7_DAYS,
      };

      for (const dtoKey of Object.keys(data) as Array<
        keyof UpdateTenantNotificationsDto
      >) {
        const type = dtoKeyToNotificationTypeMap[dtoKey];
        if (updatedNotifications[type]) {
          console.log(`[updateNotifications] Atualizando conteúdo de ${type}`);
          updatedNotifications[type] = {
            ...updatedNotifications[type],
            defaultMessage: data[dtoKey],
          };
        } else {
          console.warn(
            `[updateNotifications] Chave não encontrada no config: ${type}`,
          );
        }
      }

      await this.tenantConfigRepository.update(
        { tenant_id: tenantId },
        { whatsapp_notification: updatedNotifications },
      );

      console.log('[updateNotifications] Atualização concluída com sucesso');
    } catch (error) {
      console.error(
        '[updateNotifications] Erro ao atualizar notificações:',
        error,
      );
      throw new Error('Erro ao atualizar notificações do tenant');
    }
  }

  getTenantConfig(tenant: string): Promise<TenantConfig | null> {
    return this.tenantConfigRepository.findOne({
      where: { tenant_id: tenant },
      relations: ['tenant'],
    });
  }

  async isTenantOwner(user: JwtPayload, tenantId: string): Promise<boolean> {
    return await this.tenantUserRepository.existsBy({
      tenant_id: tenantId,
      external_user_id: user.sub,
      role: UserTenantRole.OWNER,
    });
  }

  async updateSettings(settings: UpdateTenantSettingsDto, tenantId: string) {
    await this.tenantConfigRepository.update(
      { tenant_id: tenantId },
      {
        point_config: {
          pointsForMoneySpent: settings.pointsForMoneySpent,
          expirationInDays: settings.expirationInDays,
          minimumValueForWinPoints: settings.minimumValueForWinPoints,
        },
        whatsapp_config: {
          apikey: settings.apikey,
          baseUrl: settings.baseUrl,
          instanceName: settings.instanceName,
        },
      },
    );
  }

  async getByUserId(user: JwtPayload): Promise<Tenant[] | null> {
    return await this.tenantRepository.find({
      where: {
        users: {
          external_user_id: user.sub,
        },
      },
      relations: ['config'],
    });
  }

  async generateDefaultTenantConfig(tenant: Partial<Tenant>): Promise<void> {
    const tenantConfig = this.tenantConfigRepository.create({
      point_config: this.getDefaultPointConfig(),
      whatsapp_notification: this.getDefaultWhatsappNotificationConfig(),
      tenant_id: tenant.id,
    });

    await this.tenantConfigRepository.save(tenantConfig);
  }

  async create({ cnpj, name, slug }: CreateTenantDto): Promise<Tenant> {
    if (await this.slugAlreadyExist(slug)) {
      throw new Error('Slug tenant in use!');
    }

    const tenant = this.tenantRepository.create({
      name,
      CNPJ: cnpj,
      active: true,
      slug: slugify(slug),
    });
    return this.tenantRepository.save(tenant);
  }

  async assignUser(
    user: JwtPayload,
    tenant: Partial<Tenant>,
  ): Promise<TenantUser> {
    const tenantUser = this.tenantUserRepository.create({
      tenant_id: tenant.id,
      external_user_id: user.sub,
      role: UserTenantRole.OWNER,
    });
    return this.tenantUserRepository.save(tenantUser);
  }

  private getDefaultPointConfig(): PointConfig {
    return {
      minimumValueForWinPoints: 15,
      pointsForMoneySpent: 1,
      expirationInDays: 90,
    };
  }
  private getDefaultWhatsappNotificationConfig(): WhatsappNotificationMap {
    return {
      [WhatsappNotificationType.CUSTOMER_NEW]: {
        name: 'Novo Cliente',
        description: 'Mensagem enviada quando um novo cliente é cadastrado',
        variables: [
          { key: '{{customer_name}}', description: 'Nome do cliente' },
        ],
        defaultMessage:
          'Olá {{customer_name}}! 🎉\n\nSeja bem-vindo(a) ao nosso programa de fidelidade!\n\nVocê já pode começar a acumular pontos em suas compras e trocar por recompensas incríveis.\n\nObrigado por escolher a nossa loja! 💙',
      },
      [WhatsappNotificationType.TRANSACTION_ADD_POINTS]: {
        name: 'Pontos Adicionados',
        description:
          'Mensagem enviada quando pontos são adicionados à conta do cliente',
        variables: [
          { key: '{{customer_name}}', description: 'Nome do cliente' },
          {
            key: '{{points_added}}',
            description: 'Quantidade de pontos adicionados',
          },
          { key: '{{total_points}}', description: 'Total de pontos atual' },
        ],
        defaultMessage:
          'Oi {{customer_name}}! ✨\n\nVocê acabou de ganhar {{points_added}} pontos pela sua compra!\n\nSeu saldo atual: {{total_points}} pontos\n\nContinue acumulando e troque por recompensas na nossa loja! 🎁',
      },
      [WhatsappNotificationType.TRANSACTION_REDEEM_POINTS]: {
        name: 'Pontos Resgatados',
        description: 'Mensagem enviada quando o cliente resgata uma recompensa',
        variables: [
          { key: '{{customer_name}}', description: 'Nome do cliente' },
          {
            key: '{{points_used}}',
            description: 'Quantidade de pontos utilizados',
          },
          { key: '{{remaining_points}}', description: 'Pontos restantes' },
          { key: '{{reward_name}}', description: 'Nome da recompensa' },
        ],
        defaultMessage:
          'Parabéns {{customer_name}}! 🎉\n\nVocê resgatou: {{reward_name}}\nPontos utilizados: {{points_used}}\nPontos restantes: {{remaining_points}}\n\nAproveite sua recompensa na nossa loja! 😊',
      },
      [WhatsappNotificationType.POINTS_EXPIRING_7_DAYS]: {
        name: 'Pontos Expiram em 7 Dias',
        description: 'Aviso enviado 7 dias antes dos pontos expirarem',
        variables: [
          { key: '{{customer_name}}', description: 'Nome do cliente' },
          {
            key: '{{expiring_points}}',
            description: 'Quantidade de pontos que irão expirar',
          },
          { key: '{{expiration_date}}', description: 'Data de expiração' },
        ],
        defaultMessage:
          'Atenção {{customer_name}}! ⚠️\n\nSeus {{expiring_points}} pontos irão expirar em 7 dias ({{expiration_date}}).\n\nNão perca! Visite a nossa loja e troque por recompensas antes que expire. 🏃‍♂️💨',
      },
      [WhatsappNotificationType.POINTS_EXPIRING_3_DAYS]: {
        name: 'Pontos Expiram em 3 Dias',
        description: 'Aviso enviado 3 dias antes dos pontos expirarem',
        variables: [
          { key: '{{customer_name}}', description: 'Nome do cliente' },
          {
            key: '{{expiring_points}}',
            description: 'Quantidade de pontos que irão expirar',
          },
          { key: '{{expiration_date}}', description: 'Data de expiração' },
        ],
        defaultMessage:
          '🚨 URGENTE {{customer_name}}!\n\nSeus {{expiring_points}} pontos expiram em apenas 3 dias ({{expiration_date}})!\n\nCorra para a nossa loja e não perca seus pontos! ⏰',
      },
      [WhatsappNotificationType.POINTS_EXPIRING_1_DAYS]: {
        name: 'Pontos Expiram em 1 Dia',
        description: 'Aviso enviado 1 dia antes dos pontos expirarem',
        variables: [
          { key: '{{customer_name}}', description: 'Nome do cliente' },
          {
            key: '{{expiring_points}}',
            description: 'Quantidade de pontos que irão expirar',
          },
          { key: '{{expiration_date}}', description: 'Data de expiração' },
        ],
        defaultMessage:
          '🔥 ÚLTIMO DIA {{customer_name}}!\n\nSeus {{expiring_points}} pontos expiram HOJE ({{expiration_date}})!\n\nEsta é sua última chance! Venha agora para a nossa loja! 🏃‍♂️💨',
      },
    };
  }

  private slugAlreadyExist(slug: string): Promise<boolean> {
    return this.tenantRepository.existsBy({
      slug,
    });
  }
}
