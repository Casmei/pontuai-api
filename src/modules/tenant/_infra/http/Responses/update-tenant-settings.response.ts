import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantSettingsResponse {
    @ApiProperty({
        description: 'The unique identifier of the tenant settings',
        example: '6c76be07-b690-4903-93c8-395c30ddb69a'
    })
    id: string;

    @ApiProperty({
        description: 'Number of points',
        example: 1
    })
    ratioAmount: number;

    @ApiProperty({
        description: 'Spend Money Value',
        example: 1
    })
    ratioMoneySpend: number;

    @ApiProperty({
        description: 'Days to expiry of points',
        example: 90
    })
    expirationInDays: number;

    @ApiProperty({
        description: 'Minimum points for redemption',
        example: 100
    })
    minimumRedemptionValue: number;
}