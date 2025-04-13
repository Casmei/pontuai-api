import { Either, Left, Right } from 'src/_utils/either';
import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../_infra/http/dtos/create-customer.dto';
import { ICustomerRepository } from '../interfaces/customer.repository';

type Input = {
  data: CreateCustomerDto;
  tenantId: string;
};

type Output = Either<Customer, Error>;

export class CreateCustomerUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private eventDispatcher: EventDispatcher,
  ) { }

  async execute(input: Input): Promise<Output> {
    try {
      const result = await this.customerRepository.create(input.data, input.tenantId);
      this.eventDispatcher.emitAsync('customer.created', result);
      return Right.of(result);
    } catch (error) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
