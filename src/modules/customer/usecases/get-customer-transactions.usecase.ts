import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { ICustomerRepository } from '../interfaces/customer.repository'
import { CustomerTransactionsResponse } from '../_infra/http/responses/customer-transactions-response'
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository'

type Input = {
  tenantId: string
  customerId: string
  query: {
    page?: number
    limit?: number
  }
}

type Output = Either<CustomerTransactionsResponse, Error>

export class GetCustomerTransactionsUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute({ customerId, query, tenantId }: Input): Promise<Output> {
    try {
      console.log('GetCustomerTransactionsUseCase')

      const customer = await this.customerRepository.getById(
        tenantId,
        customerId,
      )

      if (!customer) return Left.of(new Error('Failed to find customer'))

      const { transactions, total } =
        await this.transactionRepository.getByCustomerId({
          customerId,
          query,
          tenantId,
        })

      const { page, limit } = query
      const totalPages = Math.ceil(total / limit!)

      return Right.of({
        data: transactions,
        currentPage: page!,
        totalItems: total,
        totalPages,
      })
    } catch (error) {
      console.log(error)
      return Left.of(new Error('Failed to create customer'))
    }
  }
}
