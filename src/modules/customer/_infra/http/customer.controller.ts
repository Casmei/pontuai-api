import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCustomerUseCase } from '../../usecases/create-customer.usecase';
import { ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CreateCustomerResponse } from './responses/creste-customer.response';
import { GetAllCustomersUseCase } from '../../usecases/get-all-customer.usecase';
import { CustomerWithPointsResponse } from './responses/get-all-customers.response';
import { GetCustomerDetailResponse } from './responses/get-customer-detail.response';
import { GetCustomerDetailUseCase } from '../../usecases/get-customer-detail.usecase';
import { GetCustomerTransactionDetailUseCase } from '../../usecases/get-customer-transaction-detail.usecase';
import { GetCustomerTransactionDetailResponse } from './responses/get-customer-transaction-detail.response';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly getCustomerDetailUseCase: GetCustomerDetailUseCase,
    private readonly getCustomerTransactionDetailUseCase: GetCustomerTransactionDetailUseCase
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
    description: 'The customer list has been successfully loaded',
    type: [CustomerWithPointsResponse], // idealmente, aqui deveria ser um objeto com os campos de paginação
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'query', required: false, description: 'Optional search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  async getAll(
    @GetTenantId() tenantId: string,
    @Query('query') query?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.getAllCustomersUseCase.execute({
      tenantId,
      query: {
        page: Number(page),
        limit: Number(limit),
        term: query
      },

    });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }


  @Get('/:customerId')
  @ApiOperation({ summary: 'Get unique customer' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully loaded',
    type: GetCustomerDetailResponse,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiParam({
    name: 'customerId',
    description: 'UUID that identifies the customer',
    example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
  })
  async getCustomerDetail(
    @GetTenantId() tenantId: string,
    @Param('customerId') customerId: string,
  ) {
    const result = await this.getCustomerDetailUseCase.execute({ tenantId, customerId });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }

  @Get('/:customerId/transactions')
  @ApiOperation({ summary: 'Get customer transaction details' })
  @ApiResponse({
    status: 200,
    description: 'The transaction customer details  has been successfully loaded',
    type: GetCustomerTransactionDetailResponse,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiParam({
    name: 'customerId',
    description: 'UUID that identifies the customer',
    example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
  })
  async getCustomerTransactionDetail(
    @GetTenantId() tenantId: string,
    @Param('customerId') customerId: string,
  ) {
    const result = await this.getCustomerTransactionDetailUseCase.execute({ tenantId, customerId });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }
}
