import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponse {
    @ApiProperty({
        description: 'The unique identifier of the customer',
        example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
    })
    id: string;

    @ApiProperty({
        description: 'Id to identify which tenant the customer belongs to',
        example: '07275dd6-940c-424a-b37e-bf2c38a1036c',
    })
    tenant_id: string;

    @ApiProperty({
        description: 'The name of the customer',
        example: 'Tiago de Castro',
    })
    name: string;

    @ApiProperty({
        description: 'The phone number of the customer',
        example: '+5533999166432',
    })
    phone: string;
}

export class CustomerWithPointsResponse {
    @ApiProperty({
        description: 'Customer details',
        type: CustomerResponse,
    })
    customer: CustomerResponse;

    @ApiProperty({
        description: 'Total points accumulated by the customer',
        example: 100,
    })
    points: number;
}
