import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantResponse {
    @ApiProperty({
        description: 'The ID of the created tenant',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    tenantId: string;
}