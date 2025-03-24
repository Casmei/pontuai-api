import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../usecases/create-customer.usecase';
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
} from './contracts/create-customer';

@Controller()
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  async create(
    @Body() customerDto: CreateCustomerRequest,
  ): Promise<CreateCustomerResponse> {
    const result = await this.createCustomerUseCase.execute(customerDto);

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }
}
