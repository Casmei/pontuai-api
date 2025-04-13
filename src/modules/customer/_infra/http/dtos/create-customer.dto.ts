import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({ description: 'Customer name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 100)
    name: string;

    @ApiProperty({ description: 'Customer phone', example: '+5533999166432' })
    @IsString()
    @IsNotEmpty({ message: 'Phone is required' })
    phone: string;
}