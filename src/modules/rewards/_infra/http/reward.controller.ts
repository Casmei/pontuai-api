import {
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRewardUseCase } from '../../usecases/create-reward.usecase';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';

@ApiTags('Reward')
@Controller('reward')
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
    @ApiHeader({ name: "x-tenant-id", required: true })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() data: CreateRewardDto, @GetTenantId() tenantId: string) {
        const result = await this.createRewardUseCase.execute({
            data,
            tenantId
        });

        if (result.isRight()) {
            return result.value;
        }
    }
}
