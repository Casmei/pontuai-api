import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import {
    addPointsType,
    ITransactionRepository,
    redeemReward,
} from '../../interfaces/transaction.repository';
import {
    Transaction,
    TransactionEnum,
} from '../../entities/transaction.entity';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    async getByCustomerId(tenantId: string, customerId: string): Promise<Transaction[] | null> {
        return await this.transactionRepository.find({
            where: { tenant_id: tenantId, customerId },
            relations: ["reward"],
            order: { createdAt: { direction: "DESC" } },
            take: 5 //todo: dinamico
        });
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

    async sumAllTransactions(customerId: string): Promise<number> {
        const now = new Date();

        const sum = await this.transactionRepository.sum('points', {
            customerId,
            expiredAt: MoreThan(now),
        });

        return sum ?? 0;
    }

    addPoints(data: addPointsType): Promise<Transaction> {
        const transaction = this.transactionRepository.create({
            customerId: data.customerId,
            points: data.points,
            type: TransactionEnum.INPUT,
            tenant_id: data.tenantId,
            value: data.value,
            expiredAt: data.expiredAt,
        });

        return this.transactionRepository.save(transaction);
    }

    async getAll(tenantId: string): Promise<Transaction[]> {
        return await this.transactionRepository.find({
            where: { tenant_id: tenantId },
            relations: ["customer", "reward"]
        });
    }
}
