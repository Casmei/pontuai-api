import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator'
import { AddPointsDto } from './dtos/create-transaction.dto'
import { AddPointsUseCase } from '../../usecases/add-points.usecase'
import { GetTransactionsUseCase } from '../../usecases/get-transactions.usecase'
import {
  DocumentCreateTransaction,
  DocumentGetAllTransactions,
} from '../decorators/transaction-docs.decorator'

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private addPointUseCase: AddPointsUseCase,
    private getTransactions: GetTransactionsUseCase,
  ) {}

  @Post()
  @DocumentCreateTransaction()
  async create(@Body() data: AddPointsDto, @GetTenantId() tenantId: string) {
    const result = await this.addPointUseCase.execute({ data, tenantId })

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message)
    }

    return result.value
  }

  @Get()
  @DocumentGetAllTransactions()
  async getAll(@GetTenantId() tenantId: string) {
    const result = await this.getTransactions.execute({ tenantId })

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message)
    }

    return result.value
  }
}
