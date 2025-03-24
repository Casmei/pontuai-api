import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomerModule } from './modules/customer/customer.module';
@Module({
  imports: [EventEmitterModule.forRoot(), CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
