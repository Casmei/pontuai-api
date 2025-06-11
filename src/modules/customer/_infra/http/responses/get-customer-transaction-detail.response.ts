import { ApiProperty } from '@nestjs/swagger'
import { TransactionResponse } from 'src/modules/transaction/_infra/http/responses/get-all-invoices.response'

export class GetCustomerTransactionDetailResponse {
  @ApiProperty({
    description: 'List of transactions performed by the customer',
    type: [TransactionResponse],
  })
  transactions: TransactionResponse[] | null

  @ApiProperty({
    description:
      'Total points earned by the customer through input transactions',
    example: 300,
  })
  earnedPoints: number

  @ApiProperty({
    description:
      'Total points redeemed by the customer through output transactions',
    example: 150,
  })
  redeemedPoints: number

  @ApiProperty({
    description: 'Total points currently available for the customer',
    example: 150,
  })
  avaliablePoints: number

  @ApiProperty({
    description: 'Total transactions',
    example: 150,
  })
  total: number
}
