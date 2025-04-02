import { ApiProperty } from '@nestjs/swagger';

export class GetMyTenantsResponse {
    @ApiProperty({
        description: 'The unique identifier of the tenant',
        example: '6c76be07-b690-4903-93c8-395c30ddb69a'
    })
    id: string;

    @ApiProperty({
        description: 'The name of the tenant',
        example: 'Byalsoft'
    })
    name: string;

    @ApiProperty({
        description: 'The business segment of the tenant',
        example: 'Softhouse'
    })
    segment: string;

    @ApiProperty({
        description: 'The CNPJ of the tenant',
        example: '30.904.014/0001-09'
    })
    CNPJ: string;

    @ApiProperty({
        description: 'Indicates whether the tenant is active',
        example: true
    })
    active: boolean;
}