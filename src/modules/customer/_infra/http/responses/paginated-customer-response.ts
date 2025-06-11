import { ApiProperty } from '@nestjs/swagger'
import { CustomerWithPointsResponse } from './get-all-customers.response'

export class PaginatedCustomerResponse {
  @ApiProperty({
    description: 'List of customers for the current page',
    type: [CustomerWithPointsResponse],
  })
  data: CustomerWithPointsResponse[]

  @ApiProperty({
    description: 'Total number of customers available (all pages)',
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
