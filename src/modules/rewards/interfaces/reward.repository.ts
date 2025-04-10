import { CreateRewardDto } from "../_infra/http/dtos/create-reward.dto";
import { Reward } from "../entities/reward.entity";

export const REWARD_REPOSITORY = 'REWARD_REPOSITORY';

export interface IRewardRepository {
    create(data: CreateRewardDto, tenantId: string): Promise<Reward>
    getAll(tenantId: string): Promise<Reward[]>
}
