import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateRewardDto {
    @ApiProperty({ description: 'Reward name', example: '10% de desconto' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 100)
    name: string;

    @ApiProperty({ description: 'Reward description', example: 'Ganhe 10% de desconto na sua próxima compra' })
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @ApiProperty({ description: 'Points required for redemption', example: 100 })
    @IsString()
    @IsNotEmpty({ message: 'Point value is required' })
    pointValue: number;
}