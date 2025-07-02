import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { CreateRewardUseCase } from '../../usecases/create-reward.usecase';
import { GetAllRewardsUseCase } from '../../usecases/get-all-reward.usecase';
import { GetRewardStatsUseCase } from '../../usecases/get-reward-stats.usecase';
import { UpdateRewardUseCase } from '../../usecases/update-reward.usecase';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { UpdateRewardDto } from './dtos/update-reward.dto';
import { CreateRewardResponse } from './responses/create-reward.response';
import { GetRewardStatsResponse } from './responses/get-reward-stats.response';

@ApiTags('Reward')
@Controller('reward')
export class RewardController {
  constructor(
    private createRewardUseCase: CreateRewardUseCase,
    private getAllRewardsUseCase: GetAllRewardsUseCase,
    private updateRewardsUseCase: UpdateRewardUseCase,
    private getRewardStatsUseCase: GetRewardStatsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({
    status: 201,
    description: 'The reward has been successfully created',
    type: CreateRewardResponse,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() data: CreateRewardDto, @GetTenantId() tenantId: string) {
    const result = await this.createRewardUseCase.execute({
      data,
      tenantId,
    });

    if (result.isRight()) {
      return result.value;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all rewards' })
  @ApiResponse({
    status: 200,
    type: [CreateRewardResponse],
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async all(@GetTenantId() tenantId: string) {
    const result = await this.getAllRewardsUseCase.execute({
      tenantId,
    });

    if (result.isRight()) {
      return result.value;
    }
  }

  @Get('/stats')
  @ApiOperation({ summary: 'Get reward stats' })
  @ApiResponse({
    status: 200,
    type: [GetRewardStatsResponse],
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRewardStats(@GetTenantId() tenantId: string) {
    const result = await this.getRewardStatsUseCase.execute({
      tenantId,
    });

    if (result.isRight()) {
      return result.value;
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update a reward' })
  @ApiResponse({
    status: 200,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Body() data: UpdateRewardDto,
    @Param('id') rewardId: string,
    @GetTenantId() tenantId: string,
  ) {
    const result = await this.updateRewardsUseCase.execute({
      rewardId,
      data,
      tenantId,
    });

    if (result.isRight()) {
      return result.value;
    }
  }
}
