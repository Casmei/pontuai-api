import { Global, Module } from '@nestjs/common';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT_DISPATCHER } from './interfaces/event-dispatcher';
import { WHATSAPP_SERVICE } from './interfaces/whatsapp-service';
import { UazapiService } from "./services/uazapi.service";

const otherProviders = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
  },
  {
    provide: WHATSAPP_SERVICE,
    useClass: UazapiService,
  },
];

@Global()
@Module({
  providers: [...otherProviders],
  exports: [...otherProviders],
})
export class SharedModule {}
