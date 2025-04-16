import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    addPointsType,
    ITransactionRepository,
} from '../../interfaces/transaction.repository';
import { Transaction, TransactionEnum } from '../../entities/transaction.entity';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private transationRepository: Repository<Transaction>,
    ) { }

    async sumAllTransactions(customerId: string): Promise<number> {
        const sum = await this.transationRepository.sum("points", { customerId });
        return sum ?? 0;
    }

    addPoints(data: addPointsType): Promise<Transaction> {
        const transaction = this.transationRepository.create({
            customerId: data.customerId,
            points: data.points,
            type: TransactionEnum.INPUT,
        });

        return this.transationRepository.save(transaction);
    }
}
