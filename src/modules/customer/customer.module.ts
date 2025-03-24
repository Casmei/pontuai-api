import { Module, Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from '../common/interfaces/event-dispatcher';
import { CustomerMemoryRepository } from './_infra/database/memory/customer-memory.repository';
import { CustomerController } from './_infra/http/customer.controller';
import { NotifyCustomerEvent } from './events/notify-customer.event';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from './interfaces/customer.repository';
import { CreateCustomerUseCase } from './usecases/create-customer.usecase';

const otherProviders: Provider[] = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
  },
];

const events: Provider[] = [
  {
    provide: NotifyCustomerEvent,
    useFactory: (eventDispatcher: EventDispatcher) =>
      new NotifyCustomerEvent(eventDispatcher),
    inject: [EVENT_DISPATCHER],
  },
];

const repositories: Provider[] = [
  {
    provide: CUSTOMER_REPOSITORY,
    useClass: CustomerMemoryRepository,
  },
];

const useCases: Provider[] = [
  {
    provide: CreateCustomerUseCase,
    useFactory: (repository: CustomerRepository, dispatcher: EventDispatcher) =>
      new CreateCustomerUseCase(repository, dispatcher),
    inject: [CUSTOMER_REPOSITORY, EVENT_DISPATCHER],
  },
];

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [...otherProviders, ...repositories, ...useCases, ...events],
})
export class CustomerModule {}
