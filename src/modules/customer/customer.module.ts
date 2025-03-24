import { Module, Provider } from '@nestjs/common';
import { CustomerMemoryRepository } from './_infra/database/memory/customer-memory.repository';
import { CUSTOMER_REPOSITORY } from './interfaces/customer.repository';
import { CreateCustomerUseCase } from './usecases/create-customer.usecase';

const repositories: Provider[] = [
  {
    provide: CUSTOMER_REPOSITORY,
    useClass: CustomerMemoryRepository,
  },
];

const useCases: Provider[] = [
  {
    provide: CreateCustomerUseCase,
    useClass: CreateCustomerUseCase,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: [...repositories, ...useCases],
})
export class CustomerModule {}
