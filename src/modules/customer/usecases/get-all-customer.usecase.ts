import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { ICustomerRepository } from '../interfaces/customer.repository'
import { PaginatedCustomerResponse } from '../_infra/http/responses/paginated-customer-response'
import { IEntryBalanceRepository } from 'src/modules/transaction/interfaces/balance-entry.repository'

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
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(input: Input): Promise<Output> {
    try {
      const { data: customers, total } = await this.customerRepository.getAll(
        input.tenantId,
        input?.query,
      )

      const { page, limit } = input.query
      const totalPages = Math.ceil(total / limit)

      const response: PaginatedCustomerResponse = {
        customers,
        totalItems: total,
        currentPage: page,
        totalPages,
      }

      return Right.of(response)
    } catch (_) {
      return Left.of(new Error('Failed to create customer'))
    }
  }
}
