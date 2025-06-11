import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { IRewardRepository } from '../interfaces/reward.repository'
import { Reward } from '../entities/reward.entity'

type Output = Either<Reward[], Error>

export class GetAllRewardsUseCase
  implements Usecase<{ tenantId: string }, Output>
{
  constructor(private rewardRepository: IRewardRepository) {}

  async execute(input: { tenantId: string }): Promise<Output> {
    try {
      const reward = await this.rewardRepository.getAll(input.tenantId)

      return Right.of(reward)
    } catch (error) {
      return Left.of(new Error(error.message))
    }
  }
}
