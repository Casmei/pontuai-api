import { Either, Left, Right } from 'src/_utils/either';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../_infra/http/dtos/create-customer.dto';
import { ICustomerRepository } from '../interfaces/customer.repository';
import { AddPointsUseCase } from 'src/modules/transaction/usecases/add-points.usecase';

type Input = {
  data: CreateCustomerDto;
  tenantId: string;
};

type Output = Either<Customer, Error>;

export class CreateCustomerUseCase implements Usecase<Input, Output> {
  constructor(
    private customerRepository: ICustomerRepository,
    private eventDispatcher: EventDispatcher,
    private addPointsUseCase: AddPointsUseCase,
  ) {}

  async execute({ data, tenantId }: Input): Promise<Output> {
    try {
      const customerAlreadyExist = await this.customerRepository.findByPhone(
        data.phone,
        tenantId,
      );

      if (customerAlreadyExist) {
        return Left.of(
          new Error('Cliente com esse número já cadastrado no sistema!'),
        );
      }

      const result = await this.customerRepository.create(data, tenantId);
      await this.eventDispatcher.emitAsync('customer.created', {
        customer: result,
        tenantId,
      });

      if (data.moneySpent) {
        await this.addPointsUseCase.execute({
          data: {
            customerId: result.id,
            moneySpent: data.moneySpent,
          },
          tenantId,
        });
      }

      return Right.of(result);
    } catch (error) {
      return Left.of(new Error('Failed to create customer'));
    }
  }
}
