import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        private transationRepository: Repository<Transaction>,
    ) { }

    async getByCustomerId(tenantId: string, customerId: string): Promise<Transaction[] | null> {
        return await this.transationRepository.find({
            where: { tenant_id: tenantId, customerId },
            relations: ["reward"],
            order: { createdAt: { direction: "DESC" } },
            take: 5 //todo: dinamico
        });
    }

    async getAll(tenantId: string): Promise<Transaction[]> {
        return await this.transationRepository.find({
            where: { tenant_id: tenantId },
            relations: ["customer", "reward"]
        });
    }

    redeemReward(data: redeemReward): Promise<Transaction> {
        const transaction = this.transationRepository.create({
            customerId: data.customerId,
            points: -Math.abs(data.reward.point_value),
            rewardId: data.reward.id,
            type: TransactionEnum.OUTPUT,
            tenant_id: data.tenantId,
        });

        return this.transationRepository.save(transaction);
    }

    async sumAllTransactions(customerId: string): Promise<number> {
        const sum = await this.transationRepository.sum('points', { customerId });
        return sum ?? 0;
    }

    addPoints(data: addPointsType): Promise<Transaction> {
        const transaction = this.transationRepository.create({
            customerId: data.customerId,
            points: data.points,
            type: TransactionEnum.INPUT,
            tenant_id: data.tenantId,
            value: data.value
        });

        return this.transationRepository.save(transaction);
    }
}
