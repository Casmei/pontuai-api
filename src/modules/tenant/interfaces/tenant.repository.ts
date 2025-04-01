import { JwtPayload } from "src/modules/auth/types/auth.types";
import { Tenant } from "../entities/tenant.entity";
import { UserTenant } from "../entities/user-tenant.entity";

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export interface ITenantRepository {
    create(tenant: Partial<Tenant>): Promise<Tenant>;
    assignUser(user: JwtPayload, tenant: Partial<Tenant>): Promise<UserTenant>
}
