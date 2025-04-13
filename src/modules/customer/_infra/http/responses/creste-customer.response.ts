import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerResponse {
    @ApiProperty({
        description: 'The unique identifier of the customer',
        example: '6c76be07-b690-4903-93c8-395c30ddb69a'
    })
    id: string;

    @ApiProperty({
        description: 'The name of the customer',
        example: 'Tiago de Castro'
    })
    name: string;

    @ApiProperty({
        description: 'The phone of the reward',
        example: '+5533999166432'
    })
    phone: string;

    @ApiProperty({
        description: 'Id to identify which tenant the customer belongs to ',
        example: '6c76be07-b690-4903-93c8-395c30ddb69a'
    })
    tenant_id: string;
}