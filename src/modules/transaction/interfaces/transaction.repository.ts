import { Reward } from 'src/modules/rewards/entities/reward.entity';
import { Transaction } from '../entities/transaction.entity';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export type addPointsType = {
    customerId: string,
    points: number,
    value: number,
    tenantId: string,
}

export type redeemReward = {
    customerId: string,
    reward: Reward,
    tenantId: string,
}

export interface ITransactionRepository {
    addPoints(
        data: addPointsType,
    ): Promise<Transaction>;

    redeemReward(
        data: redeemReward,
    ): Promise<Transaction>;

    sumAllTransactions(customerId: string): Promise<number>;

    getAll(tenantId: string): Promise<Transaction[]>

    getByCustomerId(tenantId: string, customerId: string): Promise<Transaction[] | null>
}
