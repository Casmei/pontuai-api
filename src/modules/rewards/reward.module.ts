import { Module, Provider } from '@nestjs/common';
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
import { RedeemRewardUseCase } from './usecases/redeem-reward.usecase';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../transaction/interfaces/transaction.repository';
import { CUSTOMER_REPOSITORY, ICustomerRepository } from '../customer/interfaces/customer.repository';
import { EVENT_DISPATCHER, EventDispatcher } from '../common/interfaces/event-dispatcher';
import { CustomerModule } from '../customer/customer.module';
import { TransactionModule } from '../transaction/transaction.module';
import { RedeemRewardEvent } from './events/RedeemReward.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

const otherProviders: Provider[] = [
    {
        provide: EVENT_DISPATCHER,
        useExisting: EventEmitter2,
    },
];

const repositories: Provider[] = [
    {
        provide: REWARD_REPOSITORY,
        useClass: RewardRepository,
    },
];

const events: Provider[] = [
    {
        provide: RedeemRewardEvent,
        useFactory: (eventDispatcher: EventDispatcher) =>
            new RedeemRewardEvent(eventDispatcher),
        inject: [EVENT_DISPATCHER],
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
        provide: RedeemRewardUseCase,
        useFactory: (
            rewardRepository: IRewardRepository,
            transactionRepository: ITransactionRepository,
            customerRepository: ICustomerRepository,
            dispatcher: EventDispatcher,
        ) =>
            new RedeemRewardUseCase(
                rewardRepository,
                transactionRepository,
                customerRepository,
                dispatcher,
            ),
        inject: [REWARD_REPOSITORY, TRANSACTION_REPOSITORY, CUSTOMER_REPOSITORY, EVENT_DISPATCHER],
    },
];

@Module({
    imports: [TypeOrmModule.forFeature([Reward, Tenant]), TenantModule, CustomerModule, TransactionModule],
    providers: [...repositories, ...useCases, ...events, ...otherProviders],
    controllers: [RewardController],
})
export class RewardModule { }
