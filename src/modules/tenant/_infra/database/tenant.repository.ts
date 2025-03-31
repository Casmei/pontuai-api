import { Tenant } from "../../entities/tenant.entity";

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export interface ITenantRepository {
    create(customer: Partial<Tenant>): Promise<Tenant>;
}
