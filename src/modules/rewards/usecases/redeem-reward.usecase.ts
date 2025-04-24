import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { IRewardRepository } from '../interfaces/reward.repository';
import { RedeemRewardDto } from '../_infra/http/dtos/redeem-reward.dto';
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';

type Output = Either<boolean, Error>;

export class RedeemRewardUseCase
    implements
    Usecase<
        { rewardId: string; data: RedeemRewardDto; tenantId: string },
        Output
    > {
    constructor(
        private rewardRepository: IRewardRepository,
        private transactionRepository: ITransactionRepository,
        private customerRepository: ICustomerRepository,
        private eventDispatcher: EventDispatcher,

    ) { }

    async execute(input: {
        rewardId: string;
        data: RedeemRewardDto;
        tenantId: string;
    }): Promise<Output> {
        try {
            const customer = await this.customerRepository.findById(
                input.data.customerId,
                input.tenantId,
            );

            if (!customer) {
                throw new Error("Customer doesn't exist");
            }

            const reward = await this.rewardRepository.getById(
                input.rewardId,
                input.tenantId,
            );

            if (!reward) {
                throw new Error("Reward doesn't exist");
            }

            const points = await this.transactionRepository.sumAllTransactions(
                customer.id,
            );

            if (points < reward.point_value) {
                throw new Error("User doesn't have enough points");
            }

            await this.transactionRepository.redeemReward({
                customerId: customer.id,
                reward,
                tenantId: input.tenantId
            });

            this.eventDispatcher.emitAsync('reward.redeem', { customer, reward });

            return Right.of(true);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
