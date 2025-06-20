/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEntryBalanceRepository } from '../../interfaces/balance-entry.repository';
import { EntryBalance } from '../../entities/entry-balance.entity';

@Injectable()
export class EntryBalanceRepository implements IEntryBalanceRepository {
  constructor(
    @InjectRepository(EntryBalance)
    private entryBalanceRepository: Repository<EntryBalance>,
  ) {}
  async getByCustomerId(customerId: string): Promise<EntryBalance[]> {
    return await this.entryBalanceRepository.findBy({ customerId });
  }

  async customerBalance(customerId: string): Promise<number> {
    const now = new Date();

    const result = await this.entryBalanceRepository
      .createQueryBuilder('entry')
      .select('SUM(entry.originalPoints - entry.usedPoints)', 'sum')
      .where('entry.customerId = :customerId', { customerId })
      .andWhere('entry.expiredAt > :now', { now })
      .getRawOne();

    return Number(result.sum) || 0;
  }

  async create(data: EntryBalance): Promise<void> {
    const newEntry = this.entryBalanceRepository.create(data);

    await this.entryBalanceRepository.save(newEntry);
  }
  j;
  async findAvailableByCustomerId(customerId: string): Promise<EntryBalance[]> {
    const now = new Date();

    return await this.entryBalanceRepository
      .createQueryBuilder('entry')
      .where('entry.customerId = :customerId', { customerId })
      .andWhere('entry.expiredAt > :now', { now })
      .andWhere('entry.originalPoints > entry.usedPoints')
      .orderBy('entry.expiredAt', 'ASC')
      .getMany();
  }

  async save(entry: EntryBalance): Promise<void> {
    await this.entryBalanceRepository.save(entry);
  }
}
