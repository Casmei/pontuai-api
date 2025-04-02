import {
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRewardUseCase } from '../../usecases/create-reward.usecase';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { GetSlugPipe } from 'src/modules/tenant/_infra/pipes/get-slug.pipe';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';

@Controller('reward')
export class RewardController {
    constructor(
        private createRewardUseCase: CreateRewardUseCase,
    ) { }

    @Post(':tenant_slug')
    @ApiOperation({ summary: 'Create a new reward' })
    @ApiResponse({
        status: 201,
        description: 'The reward has been successfully created',
        // type: CreateTenantResponse,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() data: CreateRewardDto, @Param('tenant_slug', GetSlugPipe) tenant: Tenant) {
        const result = await this.createRewardUseCase.execute({
            data,
            tenant
        });

        if (result.isRight()) {
            return result.value;
        }
    }
}
