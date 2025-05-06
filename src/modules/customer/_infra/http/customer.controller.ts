import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCustomerUseCase } from '../../usecases/create-customer.usecase';
import { ApiHeader, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CreateCustomerResponse } from './responses/creste-customer.response';
import { GetAllCustomersUseCase } from '../../usecases/get-all-customer.usecase';
import { CustomerWithPointsResponse } from './responses/get-all-customers.response';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created',
    type: CreateCustomerResponse,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async create(
    @Body() customerDto: CreateCustomerDto,
    @GetTenantId() tenantId: string,
  ) {
    const result = await this.createCustomerUseCase.execute({
      data: customerDto,
      tenantId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }

  @Get()
  @ApiOperation({ summary: 'Get customers' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully loaded',
    type: [CustomerWithPointsResponse],
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'query', required: false, description: 'Optional search query' })
  async getAll(
    @GetTenantId() tenantId: string,
    @Query('query') query?: string
  ) {
    const result = await this.getAllCustomersUseCase.execute({ tenantId, query });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }
}
