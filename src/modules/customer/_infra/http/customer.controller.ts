import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../usecases/create-customer.usecase';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CreateCustomerResponse } from './responses/creste-customer.response';

@Controller('customers')
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) { }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created',
    type: CreateCustomerResponse,
  })
  @ApiHeader({ name: "x-tenant-id", required: true })
  async create(
    @Body() customerDto: CreateCustomerDto,
    @GetTenantId() tenantId: string,
  ) {
    const result = await this.createCustomerUseCase.execute({ data: customerDto, tenantId });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }
}
