import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../_infra/http/dtos/create-transaction.dto';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../interfaces/transaction.repository';
import { CUSTOMER_REPOSITORY, ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { Inject } from '@nestjs/common';

type Output = Either<Transaction, Error>;

export class AddPointsUseCase implements Usecase<{ data: CreateTransactionDto, tenantId: string }, Output> {
    constructor(
        private transactionRepository: ITransactionRepository,
        private customerRepository: ICustomerRepository
    ) { }

    async execute(input: { data: CreateTransactionDto, tenantId: string }): Promise<Output> {
        try {

            //todo: disparar evento
            const customer = await this.customerRepository.findById(input.data.customerId, input.tenantId);

            if (!customer) {
                throw new Error("Customer dons't exist");
            }

            const transaction = await this.transactionRepository.addPoints(input.data, input.tenantId);

            return Right.of(transaction);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
