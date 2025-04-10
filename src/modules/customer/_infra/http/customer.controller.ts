import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../usecases/create-customer.usecase';
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
} from './contracts/create-customer';
import { ApiHeader } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';

@Controller('customers')
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) { }

  @Post()
  @ApiHeader({ name: "x-tenant-id", required: true })
  async create(
    @Body() customerDto: CreateCustomerRequest,
    @GetTenantId() tenantId: string,
  ): Promise<CreateCustomerResponse> {
    const result = await this.createCustomerUseCase.execute(customerDto);

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }
}
