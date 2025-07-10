import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('sendNewCustomerNotification')
export class CustomerConsumer extends WorkerHost {
  private readonly logger = new Logger(CustomerConsumer.name);

  process(job: Job, token?: string): Promise<any> {
    this.logger.debug('Fui chamado');
    throw new Error('Method not implemented.');
  }
}
