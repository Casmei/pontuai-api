import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomerModule } from './modules/customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';
import { TenantModule } from './modules/tenant/tenant.module';
import { AuthModule } from './modules/auth/auth.module';
import { RewardModule } from './modules/rewards/reward.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    CustomerModule,
    TenantModule,
    AuthModule,
    RewardModule,
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
