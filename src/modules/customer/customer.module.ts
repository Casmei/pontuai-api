import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from '../tenant/tenant.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CustomerController } from './_infra/http/customer.controller';
import { Customer } from './entities/customer.entity';
import { events } from './events';
import { repositories } from './interfaces';
import { CUSTOMER_REPOSITORY } from './interfaces/customer.repository';
import { useCases } from './usecases';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    BullModule.registerQueue({
      name: 'customer',
    }),
    forwardRef(() => TransactionModule),
    TenantModule,
  ],
  exports: [CUSTOMER_REPOSITORY],
  controllers: [CustomerController],
  providers: [...repositories, ...useCases, ...events],
})
export class CustomerModule {}
