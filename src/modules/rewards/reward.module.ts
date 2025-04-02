import { Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IRewardRepository, REWARD_REPOSITORY } from "./interfaces/reward.repository";
import { RewardRepository } from "./_infra/database/reward-typeorm.repository";
import { CreateRewardUseCase } from "./usecases/create-reward.usecase";
import { RewardController } from "./_infra/http/reward.controller";
import { Reward } from "./entities/reward.entity";

const repositories: Provider[] = [
    {
        provide: REWARD_REPOSITORY,
        useClass: RewardRepository,
    },
];

const useCases: Provider[] = [
    {
        provide: CreateRewardUseCase,
        useFactory: (repository: IRewardRepository) =>
            new CreateRewardUseCase(repository),
        inject: [REWARD_REPOSITORY],
    }
];

@Module({
    imports: [TypeOrmModule.forFeature([Reward])],
    providers: [...repositories, ...useCases],
    controllers: [RewardController],
})
export class RewardModule { }
