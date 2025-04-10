import { applyDecorators, SetMetadata } from '@nestjs/common';

export const SKIP_TENANT_CHECK = 'skipTenantCheck';
export const SkipTenantCheckDecorator = () => SetMetadata(SKIP_TENANT_CHECK, true);

export const SkipTenantCheck = () => {
    return applyDecorators(SkipTenantCheckDecorator)
}