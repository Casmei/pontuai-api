import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { Customer } from '../entities/customer.entity';
import { ICustomerRepository } from '../interfaces/customer.repository';
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';

type Input = {
  tenantId: string;
};

type Output = Either<{ customer: Customer, points: number }[], Error>;

export class GetAllCustomersUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private transactionRepository: ITransactionRepository,
  ) { }

  async execute(input: Input): Promise<Output> {
    try {
      const customers = await this.customerRepository.getAll(input.tenantId);

      const customersWithPoints = await Promise.all(
        customers.map(async customer => {
          const points = await this.transactionRepository.sumAllTransactions(customer.id);
          return {
            customer,
            points,
          };
        })
      );

      return Right.of(customersWithPoints);
    } catch (error) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
