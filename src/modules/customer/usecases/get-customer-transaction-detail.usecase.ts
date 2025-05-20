import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { ICustomerRepository } from '../interfaces/customer.repository';
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';
import { GetCustomerDetailResponse } from '../_infra/http/responses/get-customer-detail.response';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';

type Input = {
  tenantId: string;
  customerId: string;
};

type Output = Either<{
  transactions: Transaction[],
  earnedPoints: number,
  redeemedPoints: number,
  expiredPoints: number,
  avaliablePoints: number
}, Error>;

export class GetCustomerTransactionDetailUseCase implements Usecase<Input, Output> {
  constructor(
    private transactionRepository: ITransactionRepository,
  ) { }

  async execute(input: Input): Promise<Output> {
    try {
      const transactions = await this.transactionRepository.getByCustomerId(
        input.tenantId,
        input.customerId,
      );

      if (!transactions) return Left.of(new Error('Failed to find transactions of this user'));

      const earnedPoints = transactions
        .filter(tx => tx.type === 'input')
        .reduce((sum, tx) => sum + tx.points, 0);

      const redeemedPoints = transactions
        .filter(tx => tx.type === 'output')
        .reduce((sum, tx) => sum + tx.points, 0);

      const expiredPoints = 0;

      const avaliablePoints = earnedPoints - redeemedPoints - expiredPoints;

      return Right.of({
        transactions,
        earnedPoints,
        redeemedPoints,
        expiredPoints,
        avaliablePoints,
      });

    } catch (error) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
