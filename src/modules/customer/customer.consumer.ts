import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Customer } from './entities/customer.entity';

@Processor('customer')
export class CustomerConsumer {
  private readonly logger = new Logger(CustomerConsumer.name);

  @Process('sendNewCustomerNotification')
  async sendNewCustomerNotification(
    job: Job<{ customer: Customer; tenantId: string }>,
  ): Promise<any> {
    this.logger.log(`Processando job: ${job.name}`);
  }
}
