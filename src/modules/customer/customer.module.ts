import { forwardRef, Module, Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_DISPATCHER } from '../@shared/interfaces/event-dispatcher';
import { CustomerController } from './_infra/http/customer.controller';
import { CUSTOMER_REPOSITORY } from './interfaces/customer.repository';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../transaction/transaction.module';
import { WHATSAPP_SERVICE } from '../@shared/interfaces/whatsapp-service';
import { EvolutionService } from '../@shared/services/evolution.service';
import { TenantModule } from '../tenant/tenant.module';
import { repositories } from './interfaces';
import { events } from './events';
import { useCases } from './usecases';

const otherProviders: Provider[] = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
  },
  {
    provide: WHATSAPP_SERVICE,
    useClass: EvolutionService,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => TransactionModule),
    TenantModule,
  ],
  exports: [CUSTOMER_REPOSITORY],
  controllers: [CustomerController],
  providers: [...otherProviders, ...repositories, ...useCases, ...events],
})
export class CustomerModule {}
