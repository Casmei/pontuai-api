import {
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRewardUseCase } from '../../usecases/create-reward.usecase';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { GetSlugPipe } from 'src/modules/tenant/_infra/pipes/get-slug.pipe';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';

@ApiTags('Reward')
@Controller(':tenant_slug/reward')
export class RewardController {
    constructor(
        private createRewardUseCase: CreateRewardUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new reward' })
    @ApiResponse({
        status: 201,
        description: 'The reward has been successfully created',
        // type: CreateTenantResponse,
    })
    @ApiParam({
        name: 'tenant_slug',
        type: String,
        description: 'The unique slug identifier of the tenant',
        example: 'my-tenant',
        required: true,
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
