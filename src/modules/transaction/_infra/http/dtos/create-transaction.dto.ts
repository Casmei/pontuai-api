import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionEnum } from 'src/modules/transaction/entities/transaction.entity';

export class CreateTransactionDto {
    @ApiProperty({
        description: 'Type of the transaction (input or output)',
        example: TransactionEnum.INPUT,
        enum: TransactionEnum,
    })
    @IsEnum(TransactionEnum, { message: 'Type must be input or output' })
    type: TransactionEnum;

    @ApiProperty({
        description: 'Number of points involved in the transaction',
        example: 100,
    })
    @IsNumber({}, { message: 'Points must be a number' })
    @IsNotEmpty({ message: 'Points are required' })
    points: number;

    @ApiProperty({
        description: 'ID of the customer related to the transaction',
        example: '5e887ac4-7eed-2530-91be-10cc0a2c0ef2',
    })
    @IsUUID('4', { message: 'customerId must be a valid UUID' })
    customerId: string;

    @ApiPropertyOptional({
        description: 'ID of the reward associated with the transaction',
        example: '5e887ac4-7eed-2530-91be-10cd0a2c0ef3',
    })
    @IsUUID('4', { message: 'rewardId must be a valid UUID' })
    @IsOptional()
    rewardId?: string;
}
