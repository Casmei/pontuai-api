import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common'
import { CreateCustomerUseCase } from '../../usecases/create-customer.usecase'
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator'
import { CreateCustomerDto } from './dtos/create-customer.dto'
import { GetAllCustomersUseCase } from '../../usecases/get-all-customer.usecase'
import { GetCustomerDetailUseCase } from '../../usecases/get-customer-detail.usecase'
import { GetCustomerTransactionDetailUseCase } from '../../usecases/get-customer-transaction-detail.usecase'
import {
  DocumentCreateCustomer,
  DocumentGetCustomerDetail,
  DocumentGetCustomers,
  DocumentGetCustomerTransactionsDetail,
} from '../decorators/customer-docs.decorator'
import { DefaultPaginationQuery } from 'src/modules/@shared/decorators/default-pagination-query.decorator'
import { PaginationQueryDto } from 'src/modules/@shared/dto/pagination-query.dto'

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly getCustomerDetailUseCase: GetCustomerDetailUseCase,
    private readonly getCustomerTransactionDetailUseCase: GetCustomerTransactionDetailUseCase,
  ) {}

  @Post()
  @DocumentCreateCustomer()
  async create(
    @Body() customerDto: CreateCustomerDto,
    @GetTenantId() tenantId: string,
  ) {
    const result = await this.createCustomerUseCase.execute({
      data: customerDto,
      tenantId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message)
    }

    return result.value
  }

  @Get()
  @DocumentGetCustomers()
  async getAll(
    @GetTenantId() tenantId: string,
    @DefaultPaginationQuery({ hasSearch: true }) query: PaginationQueryDto,
  ) {
    const result = await this.getAllCustomersUseCase.execute({
      tenantId,
      query: {
        page: Number(query.page),
        limit: Number(query.limit),
        term: query.search,
      },
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message)
    }

    return result.value
  }

  @Get('/:customerId')
  @DocumentGetCustomerDetail()
  async getCustomerDetail(
    @GetTenantId() tenantId: string,
    @Param('customerId') customerId: string,
  ) {
    const result = await this.getCustomerDetailUseCase.execute({
      tenantId,
      customerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message)
    }

    return result.value
  }

  @Get('/:customerId/transactions')
  @DocumentGetCustomerTransactionsDetail()
  async getCustomerTransactionsDetail(
    @GetTenantId() tenantId: string,
    @Param('customerId') customerId: string,
    @DefaultPaginationQuery({ limitDefault: 5 }) query: PaginationQueryDto,
  ) {
    const result = await this.getCustomerTransactionDetailUseCase.execute({
      tenantId,
      customerId,
      query: {
        page: Number(query.page),
        limit: Number(query.limit),
      },
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message)
    }

    return result.value
  }
}
