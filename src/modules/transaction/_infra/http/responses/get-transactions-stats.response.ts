import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponse } from './get-all-invoices.response';

export class GetTransactionsStatsResponse {
  @ApiProperty({
    example: 300,
  })
  expiredPoints: number;

  @ApiProperty({
    example: 100,
  })
  earnedPoints: number;

  @ApiProperty({
    example: 100,
  })
  redeemedPoints: number;

  @ApiProperty({
    example: 1536,
  })
  availablePoints: number;

  @ApiProperty({
    description: 'List of transactions',
    type: [TransactionResponse],
  })
  transactions: TransactionResponse[];
}
