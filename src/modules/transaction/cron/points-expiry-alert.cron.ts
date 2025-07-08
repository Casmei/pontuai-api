import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher';
import { EntryBalance } from '../entities/entry-balance.entity';
import type { IEntryBalanceRepository } from '../interfaces/balance-entry.repository';

export class PointsExpiryAlertCron {
  private readonly logger = new Logger(PointsExpiryAlertCron.name);

  constructor(
    private entryBalanceRepository: IEntryBalanceRepository,
    private eventDispatcher: EventDispatcher,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2PM)
  async handleCron() {
    for (const days of [7, 3, 1]) {
      let expiring: EntryBalance[] = [];
      try {
        expiring =
          await this.entryBalanceRepository.getExpiringPointsWithinDays(days);
        this.logger.debug(
          `Encontradas ${expiring.length} entradas com pontos expirando em ${days} dias.`,
        );
      } catch (err) {
        this.logger.error(
          `Erro ao buscar pontos expirando em ${days} dias`,
          err,
        );
        continue;
      }

      for (const entry of expiring) {
        try {
          await this.eventDispatcher.emitAsync(
            `points.expiring-in-${days}-days`,
            {
              customer: entry.customer,
              tenantId: entry.tenantId,
              transaction: entry,
            },
          );

          this.logger.debug(
            `Evento emitido: points.expiring-in-${days}-days para customer ${entry.customer?.id}`,
          );
        } catch (err) {
          this.logger.error(
            `Erro ao emitir evento para pontos expirando em ${days} dias (customer ${entry.customer?.id})`,
            err,
          );
        }
      }
    }
  }
}
