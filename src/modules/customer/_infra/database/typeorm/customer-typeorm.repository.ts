import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { CreateCustomerDto } from '../../http/dtos/create-customer.dto'

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  //todo: esses dois métodos fazem a mesma coisa..
  getById(tenantId: string, customerId: string): Promise<Customer | null> {
    return this.customerRepository.findOneBy({
      id: customerId,
      tenant_id: tenantId,
    })
  }

  async findById(id: string, tenantId: string): Promise<Customer | null> {
    return await this.customerRepository.findOneBy({
      id,
      tenant_id: tenantId,
    })
  }

  async findByPhone(phone: string, tenantId: string): Promise<Customer | null> {
    return await this.customerRepository.findOneBy({
      phone,
      tenant_id: tenantId,
    })
  }

  async update(
    id: string,
    customer: Customer,
    tenantId: string,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOneBy({
      id,
      tenant_id: tenantId,
    })

    if (!existingCustomer) {
      throw new Error('Customer not found or does not belong to tenant')
    }

    const updated = this.customerRepository.merge(existingCustomer, customer)
    return this.customerRepository.save(updated)
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const customer = await this.customerRepository.findOneBy({
      id,
      tenant_id: tenantId,
    })

    if (!customer) {
      throw new Error('Customer not found or does not belong to tenant')
    }

    await this.customerRepository.remove(customer)
  }

  async getAll(
    tenantId: string,
    query?: {
      term?: string
      page?: number
      limit?: number
    },
  ): Promise<{ data: Customer[]; total: number }> {
    const whereClause = query?.term
      ? [
          { tenant_id: tenantId, name: ILike(`%${query.term}%`) },
          { tenant_id: tenantId, phone: ILike(`%${query.term}%`) },
        ]
      : { tenant_id: tenantId }

    const page = query?.page ?? 1
    const limit = query?.limit ?? 10
    const skip = (page - 1) * limit

    const [data, total] = await this.customerRepository.findAndCount({
      where: whereClause,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    })

    return { data, total }
  }

  async create(data: CreateCustomerDto, tenantId: string): Promise<Customer> {
    const newCustomer = this.customerRepository.create({
      name: data.name,
      phone: data.phone,
      tenant_id: tenantId,
    })

    return await this.customerRepository.save(newCustomer)
  }
}
