import { getQueueToken } from '@nestjs/bull';
import { Provider } from '@nestjs/common';
import { Queue } from 'bull';
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from 'src/modules/@shared/interfaces/event-dispatcher';
import {
  IWhatsAppService,
  WHATSAPP_SERVICE,
} from 'src/modules/@shared/interfaces/whatsapp-service';
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from 'src/modules/tenant/interfaces/tenant.repository';
import { CreatedCustomerEvent } from './created-cutomer.event';

export const events: Provider[] = [
  {
    provide: CreatedCustomerEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
      customerQueue: Queue,
    ) =>
      new CreatedCustomerEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
        customerQueue,
      ),
    inject: [
      EVENT_DISPATCHER,
      WHATSAPP_SERVICE,
      TENANT_REPOSITORY,
      getQueueToken('customer'),
    ],
  },
];
