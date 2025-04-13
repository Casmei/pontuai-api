import { applyDecorators, SetMetadata } from '@nestjs/common';

export const SKIP_TENANT_CHECK = 'skipTenantCheck';
export const SkipTenantCheck = () => SetMetadata(SKIP_TENANT_CHECK, true);