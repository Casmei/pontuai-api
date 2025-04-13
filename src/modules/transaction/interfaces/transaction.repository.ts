import { CreateTransactionDto } from "../_infra/http/dtos/create-transaction.dto";
import { Transaction } from "../entities/transaction.entity";

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface ITransactionRepository {
    addPoints(data: CreateTransactionDto, tenantId: string): Promise<Transaction>;
}
