import { Provider } from '@nestjs/common';
import { CreatedCustomerEvent } from './created-cutomer.event';
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
import { CreatedCustomerWithPointsEvent } from './created-customer-with-points.event';

export const events: Provider[] = [
  {
    provide: CreatedCustomerEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new CreatedCustomerEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
  {
    provide: CreatedCustomerWithPointsEvent,
    useFactory: (
      eventDispatcher: EventDispatcher,
      whatsAppService: IWhatsAppService,
      tenantRepository: ITenantRepository,
    ) =>
      new CreatedCustomerWithPointsEvent(
        eventDispatcher,
        whatsAppService,
        tenantRepository,
      ),
    inject: [EVENT_DISPATCHER, WHATSAPP_SERVICE, TENANT_REPOSITORY],
  },
];
