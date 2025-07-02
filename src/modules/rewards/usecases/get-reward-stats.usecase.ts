import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';
import { GetRewardStatsResponse } from '../_infra/http/responses/get-reward-stats.response';

type Output = Either<GetRewardStatsResponse[], Error>;

export class GetRewardStatsUseCase
  implements Usecase<{ tenantId: string }, Output>
{
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(input: { tenantId: string }): Promise<Output> {
    try {
      const reward = await this.transactionRepository.getGroupedRewards(
        input.tenantId,
      );

      return Right.of(reward);
    } catch (error) {
      return Left.of(new Error(error.message));
    }
  }
}
