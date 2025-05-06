import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantSettingsDto {
    @ApiProperty({ description: 'Points for money spent', example: 1 })
    @IsNumber()
    @Min(1)
    @IsNotEmpty({ message: 'pointsForMoneySpent is required' })
    pointsForMoneySpent: number;

    @ApiProperty({ description: 'Expiration points in days', example: 90 })
    @IsNumber()
    @Min(15)
    @IsNotEmpty({ message: 'expirationInDays is required' })
    expirationInDays: number;

    @ApiProperty({ description: 'Minimum value for win points', example: 100 })
    @IsNumber()
    @Min(1)
    @IsNotEmpty({ message: 'minimumValueForWinPoints is required' })
    minimumValueForWinPoints: number;
}