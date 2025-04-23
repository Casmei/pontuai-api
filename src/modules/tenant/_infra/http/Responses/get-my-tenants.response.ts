import { ApiProperty } from '@nestjs/swagger';

export class RatioConfig {
    @ApiProperty({
        description: 'The number of points earned',
        example: 1,
    })
    amount: number;

    @ApiProperty({
        description: 'The amount of money (in currency units) required to earn the points',
        example: 2,
    })
    moneySpent: number;
}

export class PointConfig {
    @ApiProperty({
        type: RatioConfig,
        description: 'Configuration for how points are earned',
    })
    ratio: RatioConfig;

    @ApiProperty({
        description: 'The number of days before points expire',
        example: 90,
    })
    expirationInDays: number;

    @ApiProperty({
        description: 'The minimum value required for a point redemption',
        example: 100,
    })
    minimumRedemptionValue: number;
}

export class WhatsappConfig {
    @ApiProperty({
        description: 'The API key for the WhatsApp integration',
        example: '1D91CC70D2BB-43C5-9EB7-42C47955E505',
    })
    apikey: string;

    @ApiProperty({
        description: 'The base URL for the WhatsApp API service',
        example: 'https://example.com.br',
    })
    baseUrl: string;

    @ApiProperty({
        description: 'The instance name used for the WhatsApp integration',
        example: 'sorveteria_amigo',
    })
    instanceName: string;
}

export class TenantConfig {
    @ApiProperty({
        description: 'The unique identifier for the config',
        example: '2d2246c4-d40f-420c-b69c-24f073435b6c',
    })
    id: string;

    @ApiProperty({
        description: 'The tenant identifier this config belongs to',
        example: '07275dd6-940c-424a-b37e-bf2c38a1036c',
    })
    tenant_id: string;

    @ApiProperty({
        type: PointConfig,
        description: 'Configuration for the tenant\'s point system',
    })
    point_config: PointConfig;

    @ApiProperty({
        type: WhatsappConfig,
        description: 'Configuration for the tenant\'s WhatsApp integration',
    })
    whatsapp_config: WhatsappConfig;
}

export class GetTenant {
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

    @ApiProperty({
        type: TenantConfig,
        description: 'Configuration object for the tenant',
    })
    config: TenantConfig;
}