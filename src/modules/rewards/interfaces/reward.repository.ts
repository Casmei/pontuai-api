import { CreateRewardDto } from "../_infra/http/dtos/create-reward.dto";
import { UpdateRewardDto } from "../_infra/http/dtos/update-reward.dto";
import { Reward } from "../entities/reward.entity";

export const REWARD_REPOSITORY = 'REWARD_REPOSITORY';

export interface IRewardRepository {
    create(data: CreateRewardDto, tenantId: string): Promise<Reward>
    update(rewardId: string, data: UpdateRewardDto, tenantId: string): void
    getAll(tenantId: string): Promise<Reward[]>
    getById(rewardId: string, tenantId: string): Promise<Reward | null>
}
