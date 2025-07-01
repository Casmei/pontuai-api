import { ApiProperty } from '@nestjs/swagger';

export class CustomerStatsResponse {
  @ApiProperty({
    description: 'Total of customers',
    example: 13,
  })
  total: number;
}
