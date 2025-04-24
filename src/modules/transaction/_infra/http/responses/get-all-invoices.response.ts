import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponse {
    @ApiProperty({
        description: 'The unique identifier of the customer',
        example: '685a5880-2982-417a-ae16-b0dd94cf1d86',
    })
    id: string;

    @ApiProperty({
        description: 'Id to identify which tenant the customer belongs to',
        example: '07275dd6-940c-424a-b37e-bf2c38a1036c',
    })
    tenant_id: string;

    @ApiProperty({
        description: 'The name of the customer',
        example: 'Tiago de Castro Lima',
    })
    name: string;

    @ApiProperty({
        description: 'The phone number of the customer',
        example: '+5533999166432',
    })
    phone: string;
}

export class RewardResponse {
    @ApiProperty({
        description: 'The unique identifier of the reward',
        example: '36e6eb8e-4178-4438-8dfa-2d723794bb93',
    })
    id: string;

    @ApiProperty({
        description: 'The name of the reward',
        example: 'Café Grátis',
    })
    name: string;

    @ApiProperty({
        description: 'The description of the reward',
        example: '',
    })
    description: string;

    @ApiProperty({
        description: 'The point cost of the reward',
        example: 100,
    })
    point_value: number;
}

export class TransactionResponse {
    @ApiProperty({
        description: 'The unique identifier of the transaction',
        example: '2d9c1d31-62a3-46ed-8b9f-84a3e97d4125',
    })
    id: string;

    @ApiProperty({
        description: 'The type of transaction (input or output)',
        example: 'input',
    })
    type: 'input' | 'output';

    @ApiProperty({
        description: 'The number of points for the transaction',
        example: 100,
    })
    points: number;

    @ApiProperty({
        description: 'The monetary value associated (if any)',
        example: 100,
        nullable: true,
    })
    value: number | null;

    @ApiProperty({
        description: 'Date when the transaction was created',
        example: '2025-04-24T21:20:04.629Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Date when the transaction was last updated',
        example: '2025-04-24T21:20:04.629Z',
    })
    updatedAt: string;

    @ApiProperty({
        description: 'The customer associated with the transaction',
        type: CustomerResponse,
        nullable: false,
    })
    customer: CustomerResponse

    @ApiProperty({
        description: 'The reward associated with the transaction (only if type is output)',
        type: RewardResponse,
        nullable: true,
    })
    reward: RewardResponse | null;
}
