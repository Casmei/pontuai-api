import { JwtPayload } from "src/modules/auth/types/auth.types";
import { Tenant } from "../entities/tenant.entity";
import { TenantUser } from "../entities/tenant-user.entity";

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export interface ITenantRepository {
    create(tenant: Partial<Tenant>): Promise<Tenant>;
    assignUser(user: JwtPayload, tenant: Partial<Tenant>): Promise<TenantUser>
    generateDefaultTenantConfig(tenant: Partial<Tenant>): Promise<void>
    getByUserId(user: JwtPayload): Promise<Tenant[] | null>;
}
