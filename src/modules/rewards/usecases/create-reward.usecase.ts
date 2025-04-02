import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { IRewardRepository } from '../interfaces/reward.repository';
import { CreateRewardDto } from '../_infra/http/dtos/create-reward.dto';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';

type Output = Either<null, Error>;

export class CreateRewardUseCase implements Usecase<{ data: CreateRewardDto, tenant: Tenant }, Output> {
    constructor(
        private rewardRepository: IRewardRepository
    ) { }

    async execute(input: { data: CreateRewardDto, tenant: Tenant }): Promise<Output> {
        try {
            return Right.of(null);
        } catch (error) {
            return Left.of(new Error(error.message));
        }
    }
}
