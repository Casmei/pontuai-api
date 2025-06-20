import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';
import { IEntryBalanceRepository } from '../interfaces/balance-entry.repository';
import { TransactionEnum } from '../entities/transaction.entity';

export class Migrate {
  constructor(
    private transactionRepository: ITransactionRepository,
    private entryBalanceRepository: IEntryBalanceRepository,
  ) {}

  async migrate(): Promise<void> {
    const tenantId = '023c679a-7b31-46ff-82cd-0ff2731481a5';
    const transactions = await this.transactionRepository.getAll(tenantId);

    for (const transaction of transactions) {
      const { customerId, type, points, createdAt, reward } = transaction;

      const expiredAt = new Date(createdAt);
      expiredAt.setDate(expiredAt.getDate() + 90);

      if (type === TransactionEnum.INPUT) {
        await this.entryBalanceRepository.create({
          customerId,
          tenantId,
          originalPoints: points,
          usedPoints: 0,
          expiredAt,
          createdAt,
        });
      } else if (type === TransactionEnum.OUTPUT) {
        const availableEntries =
          await this.entryBalanceRepository.findAvailableByCustomerId(
            customerId,
          );

        let remaining = reward.point_value;

        for (const entry of availableEntries) {
          const availablePoints = entry.availablePoints;

          if (availablePoints <= 0) continue;

          const toUse = Math.min(availablePoints, remaining);

          entry.usedPoints += toUse;

          await this.entryBalanceRepository.save(entry);

          remaining -= toUse;

          console.table({ remaining, toUse });

          if (remaining <= 0) break;
        }
      }
    }
  }
}
