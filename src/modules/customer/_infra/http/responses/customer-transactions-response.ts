import { ApiProperty } from '@nestjs/swagger'
import { CustomerWithPointsResponse } from './get-all-customers.response'
import { TransactionResponse } from 'src/modules/transaction/_infra/http/responses/get-all-invoices.response'

export class CustomerTransactionsResponse {
  @ApiProperty({
    description: 'List of transactions for the current page',
    type: [TransactionResponse],
  })
  data: CustomerWithPointsResponse[]

  @ApiProperty({
    description: 'Total number of transactions available (all pages)',
    example: 123,
  })
  totalItems: number

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  currentPage: number

  @ApiProperty({
    description: 'Total number of pages available',
    example: 13,
  })
  totalPages: number
}
