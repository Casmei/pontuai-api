import { forwardRef, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './_infra/http/transaction.controller';
import { Transaction } from './entities/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from './interfaces/transaction.repository';
import { AddPointsUseCase } from './usecases/add-points.usecase';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../customer/interfaces/customer.repository';
import { TransactionRepository } from './_infra/database/transaction-typeorm.repository';
import { CustomerModule } from '../customer/customer.module';
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from '../tenant/interfaces/tenant.repository';
import { TenantModule } from '../tenant/tenant.module';
import { GetTransactionsUseCase } from './usecases/get-transactions.usecase';
import { RedeemRewardUseCase } from './usecases/redeem-reward.usecase';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from '../rewards/interfaces/reward.repository';
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from '../@shared/interfaces/event-dispatcher';
import {
  ENRTY_BALANCE_REPOSITORY,
  IEntryBalanceRepository,
} from './interfaces/balance-entry.repository';
import { EntryBalanceRepository } from './_infra/database/balance-entry-typeorm.repository';
import { RewardModule } from '../rewards/reward.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntryBalance } from './entities/entry-balance.entity';
import { Migrate } from './usecases/migrate';

const otherProviders: Provider[] = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
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
    ) =>
      new AddPointsUseCase(
        transactionRepository,
        entryBalanceRepository,
        tenantRepository,
        customerRepository,
      ),
    inject: [
      TRANSACTION_REPOSITORY,
      ENRTY_BALANCE_REPOSITORY,
      TENANT_REPOSITORY,
      CUSTOMER_REPOSITORY,
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
    provide: Migrate,
    useFactory: (
      transactionRepository: ITransactionRepository,
      entryBalanceRepository: IEntryBalanceRepository,
    ) => new Migrate(transactionRepository, entryBalanceRepository),
    inject: [TRANSACTION_REPOSITORY, ENRTY_BALANCE_REPOSITORY],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, EntryBalance]),
    forwardRef(() => CustomerModule),
    forwardRef(() => RewardModule),
    TenantModule,
  ],
  providers: [...useCases, ...repositories, ...otherProviders],
  controllers: [TransactionController],
  exports: [TRANSACTION_REPOSITORY, ENRTY_BALANCE_REPOSITORY, AddPointsUseCase],
})
export class TransactionModule {}
