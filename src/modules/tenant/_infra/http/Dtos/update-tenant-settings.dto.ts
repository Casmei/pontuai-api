import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantSettingsDto {
    @ApiProperty({ description: 'Ratio Amount', example: 1 })
    @IsNumber()
    @Min(1)
    @IsNotEmpty({ message: 'Name is required' })
    ratioAmount: number;

    @ApiProperty({ description: 'Ratio Money Spend', example: 1 })
    @IsNumber()
    @Min(1)
    @IsNotEmpty({ message: 'ratioMoneySpent is required' })
    ratioMoneySpent: number;

    @ApiProperty({ description: 'Expiration points in days', example: 90 })
    @IsNumber()
    @IsNotEmpty({ message: 'expirationInDays is required' })
    expirationInDays: number;

    @ApiProperty({ description: 'Minimum Redemption points value', example: 100 })
    @IsNumber()
    @Min(2)
    @IsNotEmpty({ message: 'minimumRedemptionValue is required' })
    minimumRedemptionValue: number;

}