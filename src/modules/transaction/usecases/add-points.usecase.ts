import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { Transaction } from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/transaction.repository';
import { ICustomerRepository } from 'src/modules/customer/interfaces/customer.repository';
import { ITenantRepository } from 'src/modules/tenant/interfaces/tenant.repository';
import { AddPointsDto } from '../_infra/http/dtos/create-transaction.dto';
import { IEntryBalanceRepository } from '../interfaces/balance-entry.repository';

type Input = {
  data: AddPointsDto;
  tenantId: string;
};

type Output = Either<Transaction, Error>;

export class AddPointsUseCase implements Usecase<Input, Output> {
  constructor(
    private transactionRepository: ITransactionRepository,
    private entryBalanceRepository: IEntryBalanceRepository,
    private tenantRepository: ITenantRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    try {
      const { data, tenantId } = input;

      const customer = await this.customerRepository.findById(
        data.customerId,
        tenantId,
      );
      if (!customer) {
        return Left.of(new Error('Cliente não encontrado.'));
      }

      const tenantConfig =
        await this.tenantRepository.getTenantConfig(tenantId);
      if (!tenantConfig) {
        return Left.of(
          new Error('Configuração do estabelecimento não encontrada.'),
        );
      }

      const {
        minimumValueForWinPoints,
        pointsForMoneySpent,
        expirationInDays,
      } = tenantConfig.point_config;

      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + expirationInDays);

      if (!data.moneySpent || data.moneySpent <= 0) {
        return Left.of(new Error('O valor gasto deve ser maior que zero.'));
      }

      if (data.moneySpent < minimumValueForWinPoints) {
        return Left.of(
          new Error(
            `O valor gasto deve ser no mínimo R$ ${minimumValueForWinPoints.toFixed(2).replace('.', ',')}.`,
          ),
        );
      }

      const value = Math.floor(data.moneySpent);
      const points = Math.floor(value * pointsForMoneySpent);

      const transaction = await this.transactionRepository.addPoints({
        points,
        customerId: data.customerId,
        value,
        tenantId,
      });

      await this.entryBalanceRepository.create({
        customerId: data.customerId,
        tenantId,
        originalPoints: points,
        usedPoints: 0,
      });

      return Right.of(transaction);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido.';

      return Left.of(new Error('Erro ao adicionar pontos: ' + message));
    }
  }
}
