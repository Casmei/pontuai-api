import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { IRewardRepository } from '../interfaces/reward.repository'
import { CreateRewardDto } from '../_infra/http/dtos/create-reward.dto'
import { Reward } from '../entities/reward.entity'

type Output = Either<Reward, Error>

export class CreateRewardUseCase
  implements Usecase<{ data: CreateRewardDto; tenantId: string }, Output>
{
  constructor(private rewardRepository: IRewardRepository) {}

  async execute(input: {
    data: CreateRewardDto
    tenantId: string
  }): Promise<Output> {
    try {
      const reward = await this.rewardRepository.create(
        input.data,
        input.tenantId,
      )

      return Right.of(reward)
    } catch (error) {
      return Left.of(new Error(error.message))
    }
  }
}
