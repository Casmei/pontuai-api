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
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { GetTenantId } from 'src/modules/auth/decorators/get-tenant.decorator';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import { SkipTenantCheck } from '../../decorator/skip-tenant-check';
import { CreateTenantUseCase } from '../../usecases/create-tenant';
import { GetMyTenantsUseCase } from '../../usecases/get-my-tenants.usecase';
import { GetTenantNotificationsUseCase } from '../../usecases/get-tenant-notifications.usecase';
import { UpdateTenantNotificationsUseCase } from '../../usecases/update-tenant-notifications.usecase';
import { UpdateTenantSettingsUseCase } from '../../usecases/update-tenant-settings.usecase';
import CreateTenantDto from './Dtos/create-tenant.dto';
import { UpdateTenantNotificationsDto } from './Dtos/update-tenant-notifications.dto';
import { UpdateTenantSettingsDto } from './Dtos/update-tenant-settings.dto';
import { GetTenant } from './Responses/get-my-tenants.response';
import { WhatsappNotificationMapResponse } from './Responses/get-tenant-notifications.response';
import { DocumentCreateTenant } from './tenant-docs.decorator';

@Controller('tenant')
export class TenantController {
  constructor(
    private createTenantUseCase: CreateTenantUseCase,
    private getMyTenantsUseCase: GetMyTenantsUseCase,
    private updateTenantSettingsUseCase: UpdateTenantSettingsUseCase,
    private getTenantNotificationsUseCase: GetTenantNotificationsUseCase,
    private updateTenantNotificationsUseCase: UpdateTenantNotificationsUseCase,
  ) {}

  @Post()
  @DocumentCreateTenant()
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

  @Patch(':tenant_id/settings')
  @ApiOperation({ summary: 'Update tenant settings' })
  @ApiResponse({
    status: 204,
    description: "Updates the tenant's points settings",
  })
  @ApiParam({
    name: 'tenant_id',
    type: String,
    description: 'The unique id identifier of the tenant',
    example: 'my-tenant',
    required: true,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @SkipTenantCheck()
  async updateConfig(
    @GetUser() user: JwtPayload,
    @Body() data: UpdateTenantSettingsDto,
    @Param('tenant_id') tenantId: string,
  ) {
    const result = await this.updateTenantSettingsUseCase.execute({
      data,
      tenantId,
      user,
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
    type: [GetTenant],
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

  @Get('config/notifications')
  @ApiOperation({ summary: 'Get tenant notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of tenant notifications',
    type: WhatsappNotificationMapResponse,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNotifications(@GetTenantId() tenantId: string) {
    const result = await this.getTenantNotificationsUseCase.execute({
      tenantId,
    });

    if (result.isRight()) {
      return result.value;
    }
  }

  @Patch('config/notifications')
  @ApiOperation({ summary: 'Update tenant notifications' })
  @ApiResponse({
    status: 200,
    description: 'Update tenant notifications',
    type: WhatsappNotificationMapResponse,
  })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateNotifications(
    @GetTenantId() tenantId: string,
    @Body() data: UpdateTenantNotificationsDto,
  ) {
    const result = await this.updateTenantNotificationsUseCase.execute({
      tenantId,
      data,
    });

    if (result.isRight()) {
      return result.value;
    }
  }
}
