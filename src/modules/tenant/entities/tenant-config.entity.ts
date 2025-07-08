import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export interface PointConfig {
  pointsForMoneySpent: number;
  expirationInDays: number;
  minimumValueForWinPoints: number;
}

export interface WhatsappConfig {
  baseUrl: string;
  apikey: string;
  instanceName: string;
}

export enum WhatsappNotificationType {
  CUSTOMER_NEW = 'customer.new',
  TRANSACTION_ADD_POINTS = 'transaction.add_points',
  TRANSACTION_REDEEM_POINTS = 'transaction.redeem_points',
  POINTS_EXPIRING_7_DAYS = 'transaction.expire_points_7_days',
  POINTS_EXPIRING_3_DAYS = 'transaction.expire_points_3_days',
  POINTS_EXPIRING_1_DAYS = 'transaction.expire_points_1_days',
}

export interface WhatsappNotificationVariable {
  key: string;
  description: string;
}

export interface WhatsappNotificationTemplate {
  name: string;
  description: string;
  variables: WhatsappNotificationVariable[];
  defaultMessage: string;
}

export type WhatsappNotificationMap = {
  [key in WhatsappNotificationType]?: WhatsappNotificationTemplate;
};

@Entity('tenant_config')
export class TenantConfig extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  tenant_id: string;

  @OneToOne(
    () => Tenant,
    (tenant) => tenant.config,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({
    nullable: false,
    type: 'jsonb',
  })
  point_config: PointConfig;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  whatsapp_config?: WhatsappConfig;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  whatsapp_notification: WhatsappNotificationMap;
}
