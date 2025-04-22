import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RedeemRewardDto {
    @ApiProperty({ description: 'Customer id', example: '6c76be07-b690-4903-93c8-395c30ddb69a' })
    @IsString()
    @IsNotEmpty({ message: 'Customer id is required' })
    @IsUUID()
    customerId: string;
}