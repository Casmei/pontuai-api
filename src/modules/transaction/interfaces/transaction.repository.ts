import { Transaction, TransactionEnum } from '../entities/transaction.entity';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export type addPointsType = {
    customerId: string;
    points: number;
    type: TransactionEnum;
}

export interface ITransactionRepository {
    addPoints(
        data: addPointsType,
    ): Promise<Transaction>;

    sumAllTransactions(customerId: string): Promise<number>;

}
