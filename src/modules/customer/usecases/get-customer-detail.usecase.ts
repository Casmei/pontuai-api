import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { ICustomerRepository } from '../interfaces/customer.repository';
import { ITransactionRepository } from 'src/modules/transaction/interfaces/transaction.repository';
import { GetCustomerDetailResponse } from '../_infra/http/responses/get-customer-detail.response';

type Input = {
  tenantId: string;
  customerId: string;
};

type Output = Either<GetCustomerDetailResponse, Error>;

export class GetCustomerDetailUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private transactionRepository: ITransactionRepository,
  ) { }

  async execute(input: Input): Promise<Output> {
    try {
      const customer = await this.customerRepository.getById(
        input.tenantId,
        input.customerId,
      );

      if (!customer) return Left.of(new Error('Failed to find customer'));

      const points = await this.transactionRepository.sumAllTransactions(
        customer.id,
      );

      return Right.of({
        id: customer.id,
        name: customer.name,
        memberSince: customer.created_at,
        phone: customer.phone,
        points,
        status: 'active',
        address: undefined,
        birthdate: undefined,
        email: undefined,
        preferences: undefined,
        tags: undefined,
        tier: undefined,
      });
    } catch (error) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
