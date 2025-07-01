import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { CustomerStatsResponse } from '../_infra/http/responses/customer-stats.response';
import { ICustomerRepository } from '../interfaces/customer.repository';

type Input = {
  tenantId: string;
};

type Output = Either<CustomerStatsResponse, Error>;

export class GetCustomerStatsUseCase implements Usecase<Input, Output> {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute({ tenantId }: Input): Promise<Output> {
    try {
      const total = await this.customerRepository.getTotal(tenantId);
      return Right.of({
        total,
      });
    } catch (error) {
      console.log(error);
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
