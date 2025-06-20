import { Global, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EvolutionService } from './services/evolution.service'; // ajuste o path se necessário
import { EVENT_DISPATCHER } from './interfaces/event-dispatcher';
import { WHATSAPP_SERVICE } from './interfaces/whatsapp-service';

const otherProviders = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
  },
  {
    provide: WHATSAPP_SERVICE,
    useClass: EvolutionService,
  },
];

@Global()
@Module({
  providers: [...otherProviders],
  exports: [...otherProviders],
})
export class SharedModule {}
