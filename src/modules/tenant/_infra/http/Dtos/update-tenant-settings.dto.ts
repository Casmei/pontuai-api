import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

    @ApiPropertyOptional({ description: 'base url of evolution service', example: "https://evolution.kontact.com.br", nullable: true })
    @IsOptional()
    @IsString()
    baseUrl?: string;


    @ApiPropertyOptional({ description: 'Api key of evolution service', example: "4D91C370D2BB-43B5-9EB7-42B47955E505", nullable: true })
    @IsOptional()
    @IsString()
    apikey?: string;

    @ApiPropertyOptional({ description: 'Instance name of evolution service', example: "sorvete-amigo", nullable: true })
    @IsOptional()
    @IsString()
    instanceName?: string;
}