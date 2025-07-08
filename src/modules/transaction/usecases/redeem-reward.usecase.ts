import { Either, Left, Right } from 'src/_utils/either';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { IRewardRepository } from 'src/modules/rewards/interfaces/reward.repository';
import { RedeemRewardDto } from 'src/modules/transaction/_infra/http/dtos/redeem-reward.dto';
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';
import { IEntryBalanceRepository } from '../interfaces/balance-entry.repository';

type Output = Either<boolean, Error>;

type Input = {
  rewardId: string;
  tenantId: string;
  data: RedeemRewardDto;
};

export class RedeemRewardUseCase implements Usecase<Input, Output> {
  constructor(
    private rewardRepository: IRewardRepository,
    private transactionRepository: ITransactionRepository,
    private customerRepository: ICustomerRepository,
    private eventDispatcher: EventDispatcher,
    private entryBalanceRepository: IEntryBalanceRepository,
  ) {}

  async execute(input: {
    rewardId: string;
    data: RedeemRewardDto;
    tenantId: string;
  }): Promise<Output> {
    try {
      const customer = await this.customerRepository.findById(
        input.data.customerId,
        input.tenantId,
      );

      if (!customer) {
        throw new Error("Customer doesn't exist");
      }

      const reward = await this.rewardRepository.getById(
        input.rewardId,
        input.tenantId,
      );

      if (!reward) {
        throw new Error("Reward doesn't exist");
      }

      const availablePoints = await this.entryBalanceRepository.customerBalance(
        customer.id,
      );

      if (reward.point_value > availablePoints) {
        throw new Error('Insufficient points to redeem this reward');
      }

      const availableEntries =
        await this.entryBalanceRepository.findAvailableByCustomerId(
          customer.id,
        );

      let remaining = reward.point_value;

      for (const entry of availableEntries) {
        const available = entry.availablePoints;

        if (available <= 0) continue;

        const toUse = Math.min(available, remaining);

        entry.usedPoints += toUse;

        await this.entryBalanceRepository.save(entry);

        remaining -= toUse;
        if (remaining <= 0) break;
      }

      await this.transactionRepository.redeemReward({
        customerId: customer.id,
        reward,
        tenantId: input.tenantId,
      });

      await this.eventDispatcher.emitAsync('reward.redeem', {
        customer,
        reward,
        tenantId: input.tenantId,
        pointsUsed: reward.point_value,
        remainingPoints: await this.entryBalanceRepository.customerBalance(
          customer.id,
        ),
      });

      return Right.of(true);
    } catch (error) {
      return Left.of(new Error(error.message));
    }
  }
}
