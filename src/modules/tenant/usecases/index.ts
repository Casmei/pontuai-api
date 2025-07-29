import type { Provider } from '@nestjs/common';
import { CreateTenantUseCase } from './create-tenant';
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from '../interfaces/tenant.repository';
import { GetMyTenantsUseCase } from './get-my-tenants.usecase';
import { UpdateTenantSettingsUseCase } from './update-tenant-settings.usecase';
import { GetTenantNotificationsUseCase } from './get-tenant-notifications.usecase';
import { UpdateTenantNotificationsUseCase } from './update-tenant-notifications.usecase';

export const useCases: Provider[] = [
  {
    provide: CreateTenantUseCase,
    useFactory: (repository: ITenantRepository) =>
      new CreateTenantUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: GetMyTenantsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new GetMyTenantsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: UpdateTenantSettingsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new UpdateTenantSettingsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: GetTenantNotificationsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new GetTenantNotificationsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
  {
    provide: UpdateTenantNotificationsUseCase,
    useFactory: (repository: ITenantRepository) =>
      new UpdateTenantNotificationsUseCase(repository),
    inject: [TENANT_REPOSITORY],
  },
];
