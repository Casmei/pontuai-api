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
import { AddPointsDto } from './dtos/create-transaction.dto';
import { AddPointsUseCase } from '../../usecases/add-points.usecase';
import { GetTransactionsUseCase } from '../../usecases/get-transactions.usecase';
import {
  DocumentCreateTransaction,
  DocumentGetAllTransactions,
  DocumentRedemptionTransaction,
} from '../decorators/transaction-docs.decorator';
import { RedeemRewardDto } from './dtos/redeem-reward.dto';
import { RedeemRewardUseCase } from '../../usecases/redeem-reward.usecase';
import { Migrate } from '../../usecases/migrate';
import { SkipAuth } from 'src/modules/auth/decorators/skip-auth.decorator';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private addPointUseCase: AddPointsUseCase,
    private getTransactions: GetTransactionsUseCase,
    private redeemRewardUseCase: RedeemRewardUseCase,
    private migrateUseCase: Migrate,
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

  @Get('yeah-bitch')
  @DocumentGetAllTransactions()
  @SkipAuth()
  async migrate() {
    await this.migrateUseCase.migrate();
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
