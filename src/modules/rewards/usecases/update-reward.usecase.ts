import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { IRewardRepository } from '../interfaces/reward.repository';
import { CreateRewardDto } from '../_infra/http/dtos/create-reward.dto';
import { UpdateRewardDto } from '../_infra/http/dtos/update-reward.dto';

type Output = Either<boolean, Error>;

export class UpdateRewardUseCase implements Usecase<{ rewardId: string, data: CreateRewardDto, tenantId: string }, Output> {
    constructor(
        private rewardRepository: IRewardRepository
    ) { }

    async execute(input: { rewardId: string, data: UpdateRewardDto, tenantId: string }): Promise<Output> {
        try {
            this.rewardRepository.update(input.rewardId, input.data, input.tenantId,);

            return Right.of(true);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
