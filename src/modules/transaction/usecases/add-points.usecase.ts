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

            const value = data.moneySpent

            if (!customer) {
                throw new Error("Customer doesn't exist");
            }

            const tenantConfig = await this.tenantRepository.getTenantConfig(tenantId);
            if (!tenantConfig?.point_config?.ratio) {
                throw new Error("Tenant ratio config not found");
            }

            console.log(tenantConfig.point_config.ratio);

            const { amount, moneySpent } = tenantConfig.point_config.ratio;

            if (!data.moneySpent || data.moneySpent <= 0) {
                throw new Error("Invalid moneySpent value");
            }

            const calculatedPoints = Math.floor((data.moneySpent / moneySpent) * amount);

            const transaction = await this.transactionRepository.addPoints({
                points: calculatedPoints,
                customerId: data.customerId,
                value,
                tenantId
            });

            console.log(transaction);

            return Right.of(transaction);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
