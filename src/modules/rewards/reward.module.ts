import { forwardRef, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { Tenant } from '../tenant/entities/tenant.entity';
import { TenantModule } from '../tenant/tenant.module';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../transaction/interfaces/transaction.repository';
import { TransactionModule } from '../transaction/transaction.module';
import { RewardRepository } from './_infra/database/reward-typeorm.repository';
import { RewardController } from './_infra/http/reward.controller';
import { Reward } from './entities/reward.entity';
import {
  IRewardRepository,
  REWARD_REPOSITORY,
} from './interfaces/reward.repository';
import { CreateRewardUseCase } from './usecases/create-reward.usecase';
import { GetAllRewardsUseCase } from './usecases/get-all-reward.usecase';
import { GetRewardStatsUseCase } from './usecases/get-reward-stats.usecase';
import { UpdateRewardUseCase } from './usecases/update-reward.usecase';

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
  {
    provide: GetRewardStatsUseCase,
    useFactory: (repository: ITransactionRepository) =>
      new GetRewardStatsUseCase(repository),
    inject: [TRANSACTION_REPOSITORY],
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, Tenant]),
    TenantModule,
    forwardRef(() => TransactionModule),
    forwardRef(() => CustomerModule),
  ],
  providers: [...repositories, ...useCases],
  controllers: [RewardController],
  exports: [REWARD_REPOSITORY],
})
export class RewardModule {}
