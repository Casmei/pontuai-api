import { ApiProperty } from '@nestjs/swagger'

export class GetCustomerBalanceStatsResponse {
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
    description: 'Total points expired for the customer',
    example: 150,
  })
  expiredPoints: number

  @ApiProperty({
    description: 'Total loyalty or reward points accumulated by the member',
    example: 45,
  })
  points: number
}
