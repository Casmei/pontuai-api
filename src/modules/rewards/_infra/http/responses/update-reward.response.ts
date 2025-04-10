import { ApiProperty } from '@nestjs/swagger';

export class UpdateRewardResponse {
    @ApiProperty({
        description: 'Response status',
        example: true,
    })
    id: string;

    @ApiProperty({
        description: 'The name of the reward',
        example: '10% de desconto'
    })
    name: string;

    @ApiProperty({
        description: 'The description of the reward',
        example: '10% of discount in your next purchase'
    })
    description: string;

    @ApiProperty({
        description: 'The points needed to redeem the reward',
        example: 200
    })
    point_value: number;

    @ApiProperty({
        description: 'Id to identify which tenant the reward belongs to ',
        example: '6c76be07-b690-4903-93c8-395c30ddb69a'
    })
    tenant_id: string;
}