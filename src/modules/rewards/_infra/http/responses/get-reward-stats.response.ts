import { ApiProperty } from '@nestjs/swagger';

export class GetRewardStatsResponse {
  @ApiProperty({
    description: 'The name of the reward',
    example: '10% de desconto',
  })
  name: string;

  @ApiProperty({
    description: 'Total de vezes que o reward foi resgatado',
    example: 100,
  })
  total: number;
}
