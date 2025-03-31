import { Tenant } from "../entities/tenant.entity";

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export interface CustomerRepository {
    create(customer: Tenant): Promise<Tenant>;
    findById(id: string): Promise<Tenant | null>;
    update(id: string, customer: Tenant): Promise<Tenant>;
    delete(id: string): Promise<void>;
}
