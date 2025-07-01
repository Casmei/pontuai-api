import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { AddPointsUseCase } from '../../usecases/add-points.usecase';
import { GetTransactionsStatsUseCase } from '../../usecases/get-transactions-stats.usecase';
import { GetTransactionsUseCase } from '../../usecases/get-transactions.usecase';
import { RedeemRewardUseCase } from '../../usecases/redeem-reward.usecase';
import {
  DocumentCreateTransaction,
  DocumentGetAllTransactions,
  DocumentRedemptionTransaction,
  DocumentTransactionsStats,
} from '../decorators/transaction-docs.decorator';
import { AddPointsDto } from './dtos/create-transaction.dto';
import { RedeemRewardDto } from './dtos/redeem-reward.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private addPointUseCase: AddPointsUseCase,
    private getTransactions: GetTransactionsUseCase,
    private getTransactionsStats: GetTransactionsStatsUseCase,

    private redeemRewardUseCase: RedeemRewardUseCase,
  ) {}

  @Post()
  @DocumentCreateTransaction()
  async create(@Body() data: AddPointsDto, @GetTenantId() tenantId: string) {
    const result = await this.addPointUseCase.execute({ data, tenantId });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }

  @Get()
  @DocumentGetAllTransactions()
  async getAll(@GetTenantId() tenantId: string) {
    const result = await this.getTransactions.execute({ tenantId });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }

  @Get('stats')
  @DocumentTransactionsStats()
  async getStats(@GetTenantId() tenantId: string) {
    const result = await this.getTransactionsStats.execute({ tenantId });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }

  @Patch('/:id/redeem')
  @DocumentRedemptionTransaction()
  async redeem(
    @Body() data: RedeemRewardDto,
    @Param('id') rewardId: string,
    @GetTenantId() tenantId: string,
  ) {
    const result = await this.redeemRewardUseCase.execute({
      rewardId,
      data,
      tenantId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }
}
