import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { CreateCustomerDto } from '../../http/dtos/create-customer.dto';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
    constructor(
        @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    ) { }

    async findById(id: string, tenantId: string): Promise<Customer | null> {
        return this.customerRepository.findOneBy({
            id,
            tenant_id: tenantId,
        });
    }

    async update(id: string, customer: Customer, tenantId: string): Promise<Customer> {
        const existingCustomer = await this.customerRepository.findOneBy({
            id,
            tenant_id: tenantId,
        });

        if (!existingCustomer) {
            throw new Error('Customer not found or does not belong to tenant');
        }

        const updated = this.customerRepository.merge(existingCustomer, customer);
        return this.customerRepository.save(updated);
    }

    async delete(id: string, tenantId: string): Promise<void> {
        const customer = await this.customerRepository.findOneBy({
            id,
            tenant_id: tenantId,
        });

        if (!customer) {
            throw new Error('Customer not found or does not belong to tenant');
        }

        await this.customerRepository.remove(customer);
    }

    async getAll(tenantId: string): Promise<Customer[]> {
        return this.customerRepository.findBy({ tenant_id: tenantId });
    }

    async create(data: CreateCustomerDto, tenantId: string): Promise<Customer> {
        const newCustomer = this.customerRepository.create({
            name: data.name,
            phone: data.phone,
            tenant_id: tenantId,
        });

        return this.customerRepository.save(newCustomer);
    }
}

