import { Customer } from 'src/modules/customer/entities/customer.entity';
import { CustomerRepository } from 'src/modules/customer/interfaces/customer.repository';

export class CustomerMemoryRepository implements CustomerRepository {
  private customers: Customer[] = [];

  async create(customer: Customer): Promise<Customer> {
    this.customers.push(customer);
    return customer;
  }
  async findById(id: string): Promise<Customer | null> {
    return this.customers.find((customer) => customer.id === id) || null;
  }

  async update(id: string, customer: Customer): Promise<Customer> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    this.customers[index] = customer;
    return customer;
  }
  async delete(id: string): Promise<void> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    this.customers.splice(index, 1);
  }
}
