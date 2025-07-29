import { Provider } from '@nestjs/common';
import { TENANT_REPOSITORY } from './tenant.repository';
import { TenantRepository } from '../_infra/database/tenant-typeorm.repository';

export const repositories: Provider[] = [
  {
    provide: TENANT_REPOSITORY,
    useClass: TenantRepository,
  },
];
