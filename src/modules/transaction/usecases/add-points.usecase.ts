import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { Transaction } from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/transaction.repository';
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { AddPointsDto } from '../_infra/http/dtos/create-transaction.dto';

type Input = {
    data: AddPointsDto;
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

            if (!tenantConfig) {
                throw new Error("Invalid tenant config value");
            }

            if (!data.moneySpent || data.moneySpent <= 0) {
                throw new Error("Invalid moneySpent value");
            }

            const value = Math.floor(data.moneySpent)
            const points = Math.floor(value / tenantConfig.point_config.pointsForMoneySpent)

            const transaction = await this.transactionRepository.addPoints({
                points,
                customerId: data.customerId,
                value,
                tenantId
            });

            return Right.of(transaction);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
