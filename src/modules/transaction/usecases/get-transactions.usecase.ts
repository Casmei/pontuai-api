import { Either, Left, Right } from 'src/_utils/either'
import { Usecase } from 'src/modules/@shared/interfaces/usecase'
import { Transaction } from '../entities/transaction.entity'
import { ITransactionRepository } from '../interfaces/transaction.repository'

type Input = {
  tenantId: string
}

type Output = Either<Transaction[], Error>

export class GetTransactionsUseCase implements Usecase<Input, Output> {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute({ tenantId }: Input): Promise<Output> {
    try {
      const transactions = await this.transactionRepository.getAll(tenantId)

      return Right.of(transactions)
    } catch (error) {
      return Left.of(new Error(error.message))
    }
  }
}
