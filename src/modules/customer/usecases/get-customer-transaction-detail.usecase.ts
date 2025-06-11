import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository'
import { GetCustomerTransactionDetailResponse } from '../_infra/http/responses/get-customer-transaction-detail.response'
import { PaginationQueryDto } from 'src/modules/@shared/dto/pagination-query.dto'

type Input = {
  tenantId: string
  customerId: string
  query: PaginationQueryDto
}

type Output = Either<GetCustomerTransactionDetailResponse, Error>

export class GetCustomerTransactionDetailUseCase
  implements Usecase<Input, Output>
{
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(data: Input): Promise<Output> {
    try {
      const { transactions, total } =
        await this.transactionRepository.getByCustomerId(data)

      let earnedPoints = 0,
        redeemedPoints = 0,
        avaliablePoints = 0

      if (transactions) {
        earnedPoints = transactions
          .filter((tx) => tx.type === 'input')
          .reduce((sum, tx) => sum + tx.points, 0)

        redeemedPoints = transactions
          .filter((tx) => tx.type === 'output')
          .reduce((sum, tx) => sum + tx.points, 0)

        avaliablePoints = earnedPoints - redeemedPoints
      }

      return Right.of({
        transactions,
        earnedPoints,
        redeemedPoints,
        avaliablePoints,
        total,
      })
    } catch (_) {
      return Left.of(new Error('Failed to create customer'))
    }
  }
}
