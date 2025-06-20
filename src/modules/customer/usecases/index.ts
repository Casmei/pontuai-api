import { Provider } from '@nestjs/common';
import { CreateCustomerUseCase } from './create-customer.usecase';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../interfaces/customer.repository';
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from 'src/modules/@shared/interfaces/event-dispatcher';
import { AddPointsUseCase } from 'src/modules/transaction/usecases/add-points.usecase';
import { GetAllCustomersUseCase } from './get-all-customer.usecase';
import { GetCustomerDetailUseCase } from './get-customer-detail.usecase';
import {
  ENRTY_BALANCE_REPOSITORY,
  IEntryBalanceRepository,
} from 'src/modules/transaction/interfaces/balance-entry.repository';
import { GetCustomerBalanceStatsUseCase } from './get-customer-balance-stats.usecase';
import { GetCustomerTransactionsUseCase } from './get-customer-transactions.usecase';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'src/modules/transaction/interfaces/transaction.repository';

export const useCases: Provider[] = [
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
];
