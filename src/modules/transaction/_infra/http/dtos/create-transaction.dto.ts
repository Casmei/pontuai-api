import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class AddPointsDto {
    @ApiProperty({
        description: 'Money spent in the transaction',
        example: 100,
    })
    @IsNumber({}, { message: 'Money spent must be a number' })
    @IsNotEmpty({ message: 'Money spent are required' })
    moneySpent: number;

    @ApiProperty({
        description: 'ID of the customer related to the transaction',
        example: '5e887ac4-7eed-2530-91be-10cc0a2c0ef2',
    })
    @IsUUID('4', { message: 'customerId must be a valid UUID' })
    customerId: string;
}
