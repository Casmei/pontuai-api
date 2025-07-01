import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { IEntryBalanceRepository } from 'src/modules/transaction/interfaces/balance-entry.repository';
import { GetCustomerDetailResponse } from '../_infra/http/responses/get-customer-detail.response';
import { ICustomerRepository } from '../interfaces/customer.repository';

type Input = {
  tenantId: string;
  customerId: string;
};

type Output = Either<GetCustomerDetailResponse, Error>;

export class GetCustomerDetailUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private entryBalanceRepository: IEntryBalanceRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    try {
      const customer = await this.customerRepository.getById(
        input.tenantId,
        input.customerId,
      );

      if (!customer) return Left.of(new Error('Failed to find customer'));

      return Right.of({
        id: customer.id,
        name: customer.name,
        memberSince: customer.created_at,
        phone: customer.phone,
        status: 'active',
        address: undefined,
        birthdate: undefined,
        email: undefined,
        preferences: undefined,
        tags: undefined,
        tier: undefined,
      });
    } catch (_) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
