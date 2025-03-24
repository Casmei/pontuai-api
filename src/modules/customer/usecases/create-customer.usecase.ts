import { Either, Left, Right } from 'src/_utils/either';
import { EventDispatcher } from 'src/modules/common/interfaces/event-dispatcher';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { Customer } from '../entities/customer.entity';
import { CustomerRepository } from '../interfaces/customer.repository';

type Input = {
  name: string;
  phone: string;
};

type Output = Either<Customer, Error>;

export class CreateCustomerUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: CustomerRepository,
    private eventDispatcher: EventDispatcher,
  ) {}

  async execute(input: Input): Promise<Output> {
    const customer = Customer.create(input);
    try {
      const result = await this.customerRepository.create(customer);
      this.eventDispatcher.emitAsync('customer.created', result);
      return Right.of(result);
    } catch (error) {
      console.log(error);
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
