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

const repositories: Provider[] = [
    {
        provide: TRANSACTION_REPOSITORY,
        useClass: TransactionRepository,
    },
];

const useCases: Provider[] = [
    {
        provide: AddPointsUseCase,
        useFactory: (
            transactionRepository: ITransactionRepository,
            tenantRepository: ITenantRepository,
            customerRepository: ICustomerRepository,
        ) =>
            new AddPointsUseCase(
                transactionRepository,
                tenantRepository,
                customerRepository,
            ),
        inject: [TRANSACTION_REPOSITORY, TENANT_REPOSITORY, CUSTOMER_REPOSITORY],
    },
    {
        provide: GetTransactionsUseCase,
        useFactory: (
            transactionRepository: ITransactionRepository,
        ) =>
            new GetTransactionsUseCase(
                transactionRepository,
            ),
        inject: [TRANSACTION_REPOSITORY],
    },
];

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), forwardRef(() => CustomerModule), TenantModule],
    providers: [...useCases, ...repositories],
    controllers: [TransactionController],
    exports: [TRANSACTION_REPOSITORY, AddPointsUseCase]
})
export class TransactionModule { }
