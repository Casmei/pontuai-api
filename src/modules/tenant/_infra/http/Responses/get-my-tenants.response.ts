import { ApiProperty } from '@nestjs/swagger';

export class GetMyTenantsResponse {
    @ApiProperty({
        description: 'The unique identifier of the tenant',
        example: '6c76be07-b690-4903-93c8-395c30ddb69a'
    })
    id: string;

    @ApiProperty({
        description: 'The name of the tenant',
        example: 'Sorvete Amigo'
    })
    name: string;

    @ApiProperty({
        description: 'The business slug of the tenant',
        example: 'sorvete-amigo'
    })
    slug: string;

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