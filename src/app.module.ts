import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';
import { SharedModule } from './modules/@shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { RewardModule } from './modules/rewards/reward.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    SharedModule,
    CustomerModule,
    TenantModule,
    AuthModule,
    RewardModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
