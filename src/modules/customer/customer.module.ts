import { forwardRef, Module, Provider } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from '../@shared/interfaces/event-dispatcher'
import { CustomerController } from './_infra/http/customer.controller'
import { NotifyCustomerEvent } from './events/notify-customer.event'
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './interfaces/customer.repository'
import { CreateCustomerUseCase } from './usecases/create-customer.usecase'
import { CustomerRepository } from './_infra/database/typeorm/customer-typeorm.repository'
import { Customer } from './entities/customer.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GetAllCustomersUseCase } from './usecases/get-all-customer.usecase'
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../transaction/interfaces/transaction.repository'
import { TransactionModule } from '../transaction/transaction.module'
import { AddPointsUseCase } from '../transaction/usecases/add-points.usecase'
import {
  IWhatsAppService,
  WHATSAPP_SERVICE,
} from '../@shared/interfaces/whatsapp-service'
import { EvolutionService } from '../@shared/services/evolution.service'
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from '../tenant/interfaces/tenant.repository'
import { TenantModule } from '../tenant/tenant.module'
import { NotifyCustomerWithPointsEvent } from './events/notify-customer-with-points.event'
import { GetCustomerDetailUseCase } from './usecases/get-customer-detail.usecase'
import { GetCustomerBalanceStatsUseCase } from './usecases/get-customer-balance-stats.usecase'
import {
  ENRTY_BALANCE_REPOSITORY,
  IEntryBalanceRepository,
} from '../transaction/interfaces/balance-entry.repository'
import { GetCustomerTransactionsUseCase } from './usecases/get-customer-transactions.usecase'

const otherProviders: Provider[] = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
  },
  {
    provide: WHATSAPP_SERVICE,
    useClass: EvolutionService,
  },
]

const events: Provider[] = [
  {
    provide: NotifyCustomerEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new NotifyCustomerEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
  {
    provide: NotifyCustomerWithPointsEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new NotifyCustomerWithPointsEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
]

const repositories: Provider[] = [
  {
    provide: CUSTOMER_REPOSITORY,
    useClass: CustomerRepository,
  },
]

const useCases: Provider[] = [
  {
    provide: CreateCustomerUseCase,
    useFactory: (
      repository: ICustomerRepository,
      dispatcher: EventDispatcher,
      addPointsUseCase: AddPointsUseCase,
    ) => new CreateCustomerUseCase(repository, dispatcher, addPointsUseCase),
    inject: [CUSTOMER_REPOSITORY, EVENT_DISPATCHER, AddPointsUseCase],
  },
  {
    provide: GetAllCustomersUseCase,
    useFactory: (customerRepository: ICustomerRepository) =>
      new GetAllCustomersUseCase(customerRepository),
    inject: [CUSTOMER_REPOSITORY],
  },
  {
    provide: GetCustomerDetailUseCase,
    useFactory: (
      customerRepository: ICustomerRepository,
      entryBalanceRepository: IEntryBalanceRepository,
    ) =>
      new GetCustomerDetailUseCase(customerRepository, entryBalanceRepository),
    inject: [CUSTOMER_REPOSITORY, ENRTY_BALANCE_REPOSITORY],
  },
  {
    provide: GetCustomerBalanceStatsUseCase,
    useFactory: (entryBalanceRepository: IEntryBalanceRepository) =>
      new GetCustomerBalanceStatsUseCase(entryBalanceRepository),
    inject: [ENRTY_BALANCE_REPOSITORY],
  },
  {
    provide: GetCustomerTransactionsUseCase,
    useFactory: (
      customerRepository: ICustomerRepository,
      transactionRepository: ITransactionRepository,
    ) =>
      new GetCustomerTransactionsUseCase(
        customerRepository,
        transactionRepository,
      ),
    inject: [CUSTOMER_REPOSITORY, TRANSACTION_REPOSITORY],
  },
]

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => TransactionModule),
    TenantModule,
  ],
  exports: [CUSTOMER_REPOSITORY],
  controllers: [CustomerController],
  providers: [...otherProviders, ...repositories, ...useCases, ...events],
})
export class CustomerModule {}
