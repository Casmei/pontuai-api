import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { Customer } from '../entities/customer.entity'
import { ICustomerRepository } from '../interfaces/customer.repository'
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository'
import { PaginatedCustomerResponse } from '../_infra/http/responses/paginated-customer-response'

type Input = {
  tenantId: string
  query: {
    term?: string
    page: number
    limit: number
  }
}

type Output = Either<PaginatedCustomerResponse, Error>

export class GetAllCustomersUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    try {
      const customers = await this.customerRepository.getAll(
        input.tenantId,
        input?.query,
      )

      const customersWithPoints = await Promise.all(
        customers.data.map(async (customer) => {
          const points = await this.transactionRepository.sumAllTransactions(
            customer.id,
          )
          return {
            customer,
            points,
          }
        }),
      )

      const { page, limit } = input.query
      const totalPages = Math.ceil(customers.total / limit)

      const response: PaginatedCustomerResponse = {
        data: customersWithPoints,
        totalItems: customers.total,
        currentPage: page,
        totalPages,
      }

      return Right.of(response)
    } catch (_) {
      return Left.of(new Error('Failed to create customer'))
    }
  }
}
