import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { IEntryBalanceRepository } from 'src/modules/transaction/interfaces/balance-entry.repository';
import { GetCustomerBalanceStatsResponse } from '../_infra/http/responses/get-customer-balance-stats.response';

type Input = {
  tenantId: string;
  customerId: string;
};

type Output = Either<GetCustomerBalanceStatsResponse, Error>;

export class GetCustomerBalanceStatsUseCase implements Usecase<Input, Output> {
  constructor(private entryBalanceRepository: IEntryBalanceRepository) {}

  async execute(data: Input): Promise<Output> {
    try {
      const balances = await this.entryBalanceRepository.getByCustomerId(
        data.customerId,
      );

      const points = await this.entryBalanceRepository.customerBalance(
        data.customerId,
      );

      let earnedPoints = 0,
        redeemedPoints = 0,
        expiredPoints = 0;

      const now = new Date();

      //TODO: Devo mover isso para o próprio SQL retornar esses dados?
      for (const entry of balances) {
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
        points,
      });
    } catch (_) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
