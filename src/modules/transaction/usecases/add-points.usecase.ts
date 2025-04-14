import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { TransactionEnum, Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../_infra/http/dtos/create-transaction.dto';
import { ITransactionRepository } from '../interfaces/transaction.repository';
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';

type Input = {
    data: CreateTransactionDto;
    tenantId: string;
};

type Output = Either<Transaction, Error>;

export class AddPointsUseCase implements Usecase<Input, Output> {
    constructor(
        private transactionRepository: ITransactionRepository,
        private tenantRepository: ITenantRepository,
        private customerRepository: ICustomerRepository
    ) { }

    async execute(input: Input): Promise<Output> {
        try {
            const { data, tenantId } = input;

            const customer = await this.customerRepository.findById(data.customerId, tenantId);


            if (!customer) {
                throw new Error("Customer doesn't exist");
            }

            const tenantConfig = await this.tenantRepository.getTenantConfig(tenantId);
            if (!tenantConfig?.point_config?.ratio) {
                throw new Error("Tenant ratio config not found");
            }

            const { amount, moneySpent } = tenantConfig.point_config.ratio;

            if (!data.moneySpent || data.moneySpent <= 0) {
                throw new Error("Invalid moneySpent value");
            }

            const calculatedPoints = Math.floor((data.moneySpent / moneySpent) * amount);

            const transaction = await this.transactionRepository.addPoints({
                customerId: data.customerId,
                type: TransactionEnum.INPUT,
                points: calculatedPoints,
            });

            return Right.of(transaction);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
