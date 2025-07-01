import { type Either, Left, Right } from 'src/_utils/either';
import type { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { GetTransactionsStatsResponse } from '../_infra/http/responses/get-transactions-stats.response';
import { IEntryBalanceRepository } from '../interfaces/balance-entry.repository';
import { ITransactionRepository } from '../interfaces/transaction.repository';

type Input = {
  tenantId: string;
};

type Output = Either<GetTransactionsStatsResponse, Error>;

export class GetTransactionsStatsUseCase implements Usecase<Input, Output> {
  constructor(
    private entryBalanceRepository: IEntryBalanceRepository,
    private transactionsRepository: ITransactionRepository,
  ) {}

  async execute({ tenantId }: Input): Promise<Output> {
    try {
      const entryBalances = await this.entryBalanceRepository.getAll(tenantId);
      const transactions = await this.transactionsRepository.getAll(tenantId);

      let earnedPoints = 0;
      let redeemedPoints = 0;
      let expiredPoints = 0;

      const now = new Date();

      //TODO: Devo mover isso para o próprio SQL retornar esses dados?
      for (const entry of entryBalances) {
        const isExpired = new Date(entry.expiredAt) <= now;
        const remainingPoints = entry.originalPoints - entry.usedPoints;

        if (isExpired && remainingPoints > 0) {
          expiredPoints += remainingPoints;
        }

        earnedPoints += entry.originalPoints;
        redeemedPoints += entry.usedPoints;
      }

      return Right.of({
        expiredPoints,
        earnedPoints,
        redeemedPoints,
        availablePoints: earnedPoints - redeemedPoints,
        transactions,
      });
    } catch (error) {
      return Left.of(new Error(error.message));
    }
  }
}
