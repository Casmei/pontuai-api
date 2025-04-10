import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRewardUseCase } from '../../usecases/create-reward.usecase';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { CreateRewardResponse } from './responses/create-reward.response';
import { GetAllRewardsUseCase } from '../../usecases/get-all-reward.usecase';

@ApiTags('Reward')
@Controller('reward')
export class RewardController {
    constructor(
        private createRewardUseCase: CreateRewardUseCase,
        private getAllRewardsUseCase: GetAllRewardsUseCase,
    ) { }

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
}
