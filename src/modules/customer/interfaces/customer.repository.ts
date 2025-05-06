import { CreateCustomerDto } from '../_infra/http/dtos/create-customer.dto';
import { Customer } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

export interface ICustomerRepository {
  create(customer: CreateCustomerDto, tenantId: string): Promise<Customer>;
  findById(id: string, tenantId: string): Promise<Customer | null>;
  update(id: string, customer: Customer, tenantId: string): Promise<Customer>;
  delete(id: string, tenantId: string): Promise<void>;
  getAll(tenantId: string, query?: string): Promise<Customer[]>;
}