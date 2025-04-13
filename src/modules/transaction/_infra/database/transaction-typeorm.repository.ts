import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../interfaces/transaction.repository';
import { Transaction } from '../../entities/transaction.entity';
import { CreateTransactionDto } from '../http/dtos/create-transaction.dto';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private transationRepository: Repository<Transaction>,
    ) { }

    addPoints(
        data: CreateTransactionDto,
        tenantId: string,
    ): Promise<Transaction> {
        const transaction = this.transationRepository.create({
            customerId: data.customerId,
            points: data.points,
            rewardId: data.rewardId,
            type: data.type,
        });

        return this.transationRepository.save(transaction);
    }
}
