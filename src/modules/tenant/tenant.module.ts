import { Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantRepository } from './_infra/database/tenant-typeorm.repository';
import { TenantController } from './_infra/http/tenant.controller';
import { TenantConfig } from './entities/tenant-config.entity';
import { TenantUser } from './entities/tenant-user.entity';
import { Tenant } from './entities/tenant.entity';
import { IsValidTenantGuard } from './guard/is-valid-tenant.guard';
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from './interfaces/tenant.repository';
import { CreateTenantUseCase } from './usecases/create-tenant';
import { GetMyTenantsUseCase } from './usecases/get-my-tenants.usecase';
import { GetTenantNotificationsUseCase } from './usecases/get-tenant-notifications.usecase';
import { UpdateTenantNotificationsUseCase } from './usecases/update-tenant-notifications.usecase';
import { UpdateTenantSettingsUseCase } from './usecases/update-tenant-settings.usecase';

const repositories: Provider[] = [
  {
    provide: TENANT_REPOSITORY,
    useClass: TenantRepository,
  },
];

const useCases: Provider[] = [
  {
    provide: CreateTenantUseCase,
    useFactory: (repository: ITenantRepository) =>
      new CreateTenantUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: GetMyTenantsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new GetMyTenantsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: UpdateTenantSettingsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new UpdateTenantSettingsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: GetTenantNotificationsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new GetTenantNotificationsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: UpdateTenantNotificationsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new UpdateTenantNotificationsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, TenantUser, TenantConfig])],
  providers: [
    ...repositories,
    ...useCases,
    {
      provide: APP_GUARD,
      useClass: IsValidTenantGuard,
    },
  ],
  exports: [TENANT_REPOSITORY],
  controllers: [TenantController],
})
export class TenantModule {}
