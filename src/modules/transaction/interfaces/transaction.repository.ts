import { Reward } from 'src/modules/rewards/entities/reward.entity';
import { Transaction } from '../entities/transaction.entity';
import { PaginationQueryDto } from 'src/modules/@shared/dto/pagination-query.dto';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export type addPointsType = {
  customerId: string;
  points: number;
  value: number;
  expiredAt: Date;
  tenantId: string;
};

export type redeemReward = {
  customerId: string;
  reward: Reward;
  tenantId: string;
};

export type getTransactionByCustomerId = {
  tenantId: string;
  customerId: string;
  query: PaginationQueryDto;
};

export interface ITransactionRepository {
  addPoints(data: addPointsType): Promise<Transaction>;

  redeemReward(data: redeemReward): Promise<Transaction>;

  getAll(tenantId: string): Promise<Transaction[]>;

  getByCustomerId(
    data: getTransactionByCustomerId,
  ): Promise<{ transactions: Transaction[]; total: number }>;

  findInputsByCustomer(id: string): Promise<Transaction[] | null>;

  findOutputsByCustomer(id: string): Promise<Transaction[] | null>;
}
