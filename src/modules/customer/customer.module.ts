import { forwardRef, Module } from '@nestjs/common';
import { CustomerController } from './_infra/http/customer.controller';
import { CUSTOMER_REPOSITORY } from './interfaces/customer.repository';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../transaction/transaction.module';
import { TenantModule } from '../tenant/tenant.module';
import { repositories } from './interfaces';
import { events } from './events';
import { useCases } from './usecases';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => TransactionModule),
    TenantModule,
  ],
  exports: [CUSTOMER_REPOSITORY],
  controllers: [CustomerController],
  providers: [...repositories, ...useCases, ...events],
})
export class CustomerModule {}
