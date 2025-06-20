import { forwardRef, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from './interfaces/reward.repository';
import { RewardRepository } from './_infra/database/reward-typeorm.repository';
import { CreateRewardUseCase } from './usecases/create-reward.usecase';
import { RewardController } from './_infra/http/reward.controller';
import { Reward } from './entities/reward.entity';
import { TenantModule } from '../tenant/tenant.module';
import { Tenant } from '../tenant/entities/tenant.entity';
import { GetAllRewardsUseCase } from './usecases/get-all-reward.usecase';
import { UpdateRewardUseCase } from './usecases/update-reward.usecase';
import { CustomerModule } from '../customer/customer.module';

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
  },
  {
    provide: GetAllRewardsUseCase,
    useFactory: (repository: IRewardRepository) =>
      new GetAllRewardsUseCase(repository),
    inject: [REWARD_REPOSITORY],
  },
  {
    provide: UpdateRewardUseCase,
    useFactory: (repository: IRewardRepository) =>
      new UpdateRewardUseCase(repository),
    inject: [REWARD_REPOSITORY],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, Tenant]),
    TenantModule,
    forwardRef(() => CustomerModule),
  ],
  providers: [...repositories, ...useCases],
  controllers: [RewardController],
  exports: [REWARD_REPOSITORY],
})
export class RewardModule {}
