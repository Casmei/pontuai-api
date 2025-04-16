import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { AddPointsDto } from './dtos/create-transaction.dto';
import { AddPointsUseCase } from '../../usecases/add-points.usecase';
import { AddPointsResponse } from './responses/AddPoints.response';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {

    constructor(private addPointUseCase: AddPointsUseCase) { }

    @Post()
    @ApiOperation({ summary: 'Create a new reward' })
    @ApiResponse({
        status: 201,
        description: 'The reward has been successfully created',
        type: AddPointsResponse,
    })
    @ApiHeader({ name: 'x-tenant-id', required: true })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() data: AddPointsDto, @GetTenantId() tenantId: string) {
        const result = await this.addPointUseCase.execute({ data, tenantId });

        if (result.isLeft()) {
            throw new BadRequestException(result.error.message);
        }

        return result.value;
    }
}
