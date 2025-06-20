import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from 'src/modules/customer/entities/customer.entity';

export enum TransactionEnum {
  OUTPUT = 'output',
  INPUT = 'input',
}

@Entity('entry_balance')
export class EntryBalance extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  tenantId: string;

  @Column({ type: 'int' })
  originalPoints: number;

  @Column({ type: 'int', default: 0 })
  usedPoints: number;

  @Column()
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get availablePoints(): number {
    return this.originalPoints - this.usedPoints;
  }
}
