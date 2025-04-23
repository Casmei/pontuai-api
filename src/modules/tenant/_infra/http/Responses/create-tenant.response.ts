import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantResponse {
    @ApiProperty({
        description: 'The unique identifier of the tenant',
        example: '07275dd6-940c-424a-b37e-bf2c38a1036c',
    })
    id: string;

    @ApiProperty({
        description: 'The name of the tenant',
        example: 'Sorvete amigo',
    })
    name: string;

    @ApiProperty({
        description: 'The CNPJ of the tenant',
        example: '62.518.633/0001-43',
    })
    CNPJ: string;

    @ApiProperty({
        description: 'The business slug of the tenant',
        example: 'sorvete-amigo',
    })
    slug: string;

    @ApiProperty({
        description: 'Indicates whether the tenant is active',
        example: true,
    })
    active: boolean;
}