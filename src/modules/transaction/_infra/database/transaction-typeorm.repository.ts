import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionEnum,
} from '../../entities/transaction.entity';
import {
  addPointsType,
  getTransactionByCustomerId,
  ITransactionRepository,
  redeemReward,
} from '../../interfaces/transaction.repository';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getGroupedRewards(tenantId: string) {
    const result = await Transaction.createQueryBuilder('transaction')
      .select('reward.name', 'rewardName')
      .addSelect('COUNT(*)', 'total')
      .innerJoin('transaction.reward', 'reward')
      .where('transaction.tenant_id = :tenantId', { tenantId })
      .andWhere('transaction.rewardId IS NOT NULL')
      .groupBy('reward.name')
      .getRawMany();

    return result.map((row) => ({
      name: row.rewardName,
      total: Number(row.total),
    }));
  }

  async findInputsByCustomer(id: string) {
    return await this.transactionRepository.find({
      where: { type: TransactionEnum.INPUT, customerId: id },
    });
  }

  async findOutputsByCustomer(id: string) {
    return await this.transactionRepository.find({
      where: { type: TransactionEnum.OUTPUT, customerId: id },
    });
  }

  async getByCustomerId(
    data: getTransactionByCustomerId,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const skip = (data.query.page! - 1) * data.query.limit!;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { tenant_id: data.tenantId, customerId: data.customerId },
        relations: ['reward'],
        order: { createdAt: { direction: 'DESC' } },
        skip,
        take: data.query.limit,
      },
    );

    return { transactions, total };
  }

  redeemReward(data: redeemReward): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      customerId: data.customerId,
      points: -Math.abs(data.reward.point_value),
      rewardId: data.reward.id,
      type: TransactionEnum.OUTPUT,
      tenant_id: data.tenantId,
    });

    return this.transactionRepository.save(transaction);
  }

  addPoints(data: addPointsType): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      customerId: data.customerId,
      points: data.points,
      type: TransactionEnum.INPUT,
      tenant_id: data.tenantId,
      value: data.value,
    });

    return this.transactionRepository.save(transaction);
  }

  async getAll(tenantId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { tenant_id: tenantId },
      relations: ['customer', 'reward'],
      order: { createdAt: 'ASC' },
    });
  }
}
