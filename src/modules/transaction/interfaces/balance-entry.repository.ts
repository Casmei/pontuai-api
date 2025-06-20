import { EntryBalance } from '../entities/entry-balance.entity';

export const ENRTY_BALANCE_REPOSITORY = 'ENRTY_BALANCE_REPOSITORY';

export interface IEntryBalanceRepository {
  create(data: Partial<EntryBalance>): Promise<void>;
  findAvailableByCustomerId(customerId: string): Promise<EntryBalance[]>;
  customerBalance(customerId: string): Promise<number>;
  save(entry: EntryBalance): Promise<void>;
  getByCustomerId(customerId: string): Promise<EntryBalance[]>;
  getExpiringPointsWithinDays(daysUntilExpiry: number): Promise<EntryBalance[]>;
}
