import { forwardRef, Module, type Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EVENT_DISPATCHER,
  type EventDispatcher,
} from '../@shared/interfaces/event-dispatcher';
import {
  IWhatsAppService,
  WHATSAPP_SERVICE,
} from '../@shared/interfaces/whatsapp-service';
import { CustomerModule } from '../customer/customer.module';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../customer/interfaces/customer.repository';
import {
  type IRewardRepository,
  REWARD_REPOSITORY,
} from '../rewards/interfaces/reward.repository';
import { RewardModule } from '../rewards/reward.module';
import {
  type ITenantRepository,
  TENANT_REPOSITORY,
} from '../tenant/interfaces/tenant.repository';
import { TenantModule } from '../tenant/tenant.module';
import { EntryBalanceRepository } from './_infra/database/balance-entry-typeorm.repository';
import { TransactionRepository } from './_infra/database/transaction-typeorm.repository';
import { TransactionController } from './_infra/http/transaction.controller';
import { PointsExpiryAlertCron } from './cron/points-expiry-alert.cron';
import { EntryBalance } from './entities/entry-balance.entity';
import { Transaction } from './entities/transaction.entity';
import { PointsAddEvent } from './events/points-add.event';
import { PointsExpireIn1DayEvent } from './events/points-expire-in-1-day.event';
import { PointsExpireIn3DaysEvent } from './events/points-expire-in-3-days.event';
import { PointsExpireIn7DaysEvent } from './events/points-expire-in-7-days.event';
import { RedeemRewardEvent } from './events/redeem-reward.event';
import {
  ENRTY_BALANCE_REPOSITORY,
  type IEntryBalanceRepository,
} from './interfaces/balance-entry.repository';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './interfaces/transaction.repository';
import { AddPointsUseCase } from './usecases/add-points.usecase';
import { GetTransactionsStatsUseCase } from './usecases/get-transactions-stats.usecase';
import { GetTransactionsUseCase } from './usecases/get-transactions.usecase';
import { RedeemRewardUseCase } from './usecases/redeem-reward.usecase';

const cron: Provider[] = [
  {
    provide: PointsExpiryAlertCron,
    useFactory: (
      entryBalanceRepository: IEntryBalanceRepository,
      dispatcher: EventDispatcher,
    ) => new PointsExpiryAlertCron(entryBalanceRepository, dispatcher),
    inject: [ENRTY_BALANCE_REPOSITORY, EVENT_DISPATCHER],
  },
];

export const events: Provider[] = [
  {
    provide: PointsExpireIn7DaysEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new PointsExpireIn7DaysEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
  {
    provide: PointsExpireIn3DaysEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new PointsExpireIn3DaysEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
  {
    provide: PointsExpireIn1DayEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new PointsExpireIn1DayEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
  {
    provide: PointsAddEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) => new PointsAddEvent(eventDispatcher, whatsAppService, tenantRepository),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
  {
    provide: RedeemRewardEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new RedeemRewardEvent(eventDispatcher, whatsAppService, tenantRepository),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
];

const repositories: Provider[] = [
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: TransactionRepository,
  },
  {
    provide: ENRTY_BALANCE_REPOSITORY,
    useClass: EntryBalanceRepository,
  },
];

const useCases: Provider[] = [
  {
    provide: AddPointsUseCase,
    useFactory: (
      transactionRepository: ITransactionRepository,
      entryBalanceRepository: IEntryBalanceRepository,
      tenantRepository: ITenantRepository,
      customerRepository: ICustomerRepository,
      dispatcher: EventDispatcher,
    ) =>
      new AddPointsUseCase(
        transactionRepository,
        entryBalanceRepository,
        tenantRepository,
        customerRepository,
        dispatcher,
      ),
    inject: [
      TRANSACTION_REPOSITORY,
      ENRTY_BALANCE_REPOSITORY,
      TENANT_REPOSITORY,
      CUSTOMER_REPOSITORY,
      EVENT_DISPATCHER,
    ],
  },
  {
    provide: GetTransactionsUseCase,
    useFactory: (transactionRepository: ITransactionRepository) =>
      new GetTransactionsUseCase(transactionRepository),
    inject: [TRANSACTION_REPOSITORY],
  },
  {
    provide: RedeemRewardUseCase,
    useFactory: (
      rewardRepository: IRewardRepository,
      transactionRepository: ITransactionRepository,
      customerRepository: ICustomerRepository,
      dispatcher: EventDispatcher,
      entryBalanceRepository: IEntryBalanceRepository,
    ) =>
      new RedeemRewardUseCase(
        rewardRepository,
        transactionRepository,
        customerRepository,
        dispatcher,
        entryBalanceRepository,
      ),
    inject: [
      REWARD_REPOSITORY,
      TRANSACTION_REPOSITORY,
      CUSTOMER_REPOSITORY,
      EVENT_DISPATCHER,
      ENRTY_BALANCE_REPOSITORY,
    ],
  },
  {
    provide: GetTransactionsStatsUseCase,
    useFactory: (
      entryBalanceRepository: IEntryBalanceRepository,
      transactionRepository: ITransactionRepository,
    ) =>
      new GetTransactionsStatsUseCase(
        entryBalanceRepository,
        transactionRepository,
      ),
    inject: [ENRTY_BALANCE_REPOSITORY, TRANSACTION_REPOSITORY],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, EntryBalance]),
    forwardRef(() => CustomerModule),
    forwardRef(() => RewardModule),
    TenantModule,
  ],
  providers: [...useCases, ...repositories, ...cron, ...events],
  controllers: [TransactionController],
  exports: [TRANSACTION_REPOSITORY, ENRTY_BALANCE_REPOSITORY, AddPointsUseCase],
})
export class TransactionModule {}
