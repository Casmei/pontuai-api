import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomerModule } from './modules/customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';
import { TenantModule } from './modules/tenant/tenant.module';
import { AuthModule } from './modules/auth/auth.module';
import { RewardModule } from './modules/rewards/reward.module';
import { APP_GUARD } from '@nestjs/core';
import { IsValidTenantGuard } from './modules/tenant/guard/is-valid-tenant.guard';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EventEmitterModule.forRoot(),
    CustomerModule,
    TenantModule,
    AuthModule,
    RewardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
