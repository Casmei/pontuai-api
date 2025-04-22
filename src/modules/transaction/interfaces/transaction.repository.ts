import { Reward } from 'src/modules/rewards/entities/reward.entity';
import { Transaction } from '../entities/transaction.entity';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export type addPointsType = {
    customerId: string,
    points: number,
}

export type redeemReward = {
    customerId: string,
    reward: Reward,
}

export interface ITransactionRepository {
    addPoints(
        data: addPointsType,
    ): Promise<Transaction>;

    redeemReward(
        data: redeemReward,
    ): Promise<Transaction>;

    sumAllTransactions(customerId: string): Promise<number>;
}
