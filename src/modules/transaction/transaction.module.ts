import { Module, Provider } from '@nestjs/common';
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

const repositories: Provider[] = [
    {
        provide: TRANSACTION_REPOSITORY,
        useClass: TransactionRepository,
    }
];

const useCases: Provider[] = [
    {
        provide: AddPointsUseCase,
        useFactory: (
            transactionRepository: ITransactionRepository,
            customerRepository: ICustomerRepository,
        ) => new AddPointsUseCase(transactionRepository, customerRepository),
        inject: [TRANSACTION_REPOSITORY, CUSTOMER_REPOSITORY],
    },
];

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), CustomerModule],
    providers: [...useCases, ...repositories],
    controllers: [TransactionController],
})
export class TransactionModule { }
