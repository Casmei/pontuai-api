import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './_infra/http/tenant.controller';
import { TenantConfig } from './entities/tenant-config.entity';
import { TenantUser } from './entities/tenant-user.entity';
import { Tenant } from './entities/tenant.entity';
import { IsValidTenantGuard } from './guard/is-valid-tenant.guard';
import { TENANT_REPOSITORY } from './interfaces/tenant.repository';
import { useCases } from './usecases';
import { repositories } from './interfaces';

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
