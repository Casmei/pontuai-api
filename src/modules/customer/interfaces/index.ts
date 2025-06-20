import { Provider } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './customer.repository';
import { CustomerRepository } from '../_infra/database/typeorm/customer-typeorm.repository';

export const repositories: Provider[] = [
  {
    provide: CUSTOMER_REPOSITORY,
    useClass: CustomerRepository,
  },
];
