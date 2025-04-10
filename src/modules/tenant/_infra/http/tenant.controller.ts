import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import CreateTenantDto from './Dtos/create-tenant.dto';
import { CreateTenantUseCase } from '../../usecases/create-tenant';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTenantResponse } from '../http/Responses/create-tenant.response';
import { GetMyTenantsUseCase } from '../../usecases/get-my-tenants.usecase';
import { GetMyTenantsResponse } from './Responses/get-my-tenants.response';
import { GetSlugPipe } from '../pipes/get-slug.pipe';
import { Tenant } from '../../entities/tenant.entity';
import { UpdateTenantSettingsDto } from './Dtos/update-tenant-settings.dto';
import { UpdateTenantSettingsUseCase } from '../../usecases/update-tenant-settings.usecase';
import { SkipTenantCheck } from '../../decorator/skip-tenant-check';

@Controller('tenant')
export class TenantController {
    constructor(
        private createTenantUseCase: CreateTenantUseCase,
        private getMyTenantsUseCase: GetMyTenantsUseCase,
        private updateTenantSettingsUseCase: UpdateTenantSettingsUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new tenant' })
    @ApiResponse({
        status: 201,
        description: 'The tenant has been successfully created',
        type: CreateTenantResponse,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @SkipTenantCheck()
    async create(@GetUser() user: JwtPayload, @Body() data: CreateTenantDto) {
        const result = await this.createTenantUseCase.execute({ data, user });

        if (result.isRight()) {
            return result.value;
        }

        throw new HttpException(
            {
                status: HttpStatus.BAD_REQUEST,
                error: result.error.message,
            },
            HttpStatus.BAD_REQUEST,
        );
    }

    @Patch(':tenant_slug/settings')
    @ApiOperation({ summary: 'Update tenant settings' })
    @ApiResponse({
        status: 204,
        description: "Updates the tenant's points settings",
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
    @SkipTenantCheck()
    async updateConfig(
        @GetUser() user: JwtPayload,
        @Body() data: UpdateTenantSettingsDto,
        @Param('tenant_slug', GetSlugPipe) tenant: Tenant,
    ) {
        const result = await this.updateTenantSettingsUseCase.execute({
            data,
            tenant,
            user
        });

        if (result.isRight()) {
            return result.value;
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get my tenants' })
    @ApiResponse({
        status: 200,
        description: 'List of tenants belonging to the authenticated user',
        type: [GetMyTenantsResponse],
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @SkipTenantCheck()
    async getMyTenants(@GetUser() user: JwtPayload) {
        const result = await this.getMyTenantsUseCase.execute({ user });

        if (result.isRight()) {
            return result.value;
        }
    }
}
