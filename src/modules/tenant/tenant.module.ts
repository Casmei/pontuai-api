import { Module, Provider } from "@nestjs/common";
import { TenantController } from "./_infra/http/tenant.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./entities/tenant.entity";
import { ITenantRepository, TENANT_REPOSITORY } from "./interfaces/tenant.repository";
import { TenantRepository } from "./_infra/database/tenant-typeorm.repository";
import { CreateTenantUseCase } from "./usecases/create-tenant";
import { TenantUser } from "./entities/tenant-user.entity";
import { TenantConfig } from "./entities/tenant-config";

const repositories: Provider[] = [
    {
        provide: TENANT_REPOSITORY,
        useClass: TenantRepository,
    },
];

const useCases: Provider[] = [
    {
        provide: CreateTenantUseCase,
        useFactory: (repository: ITenantRepository) =>
            new CreateTenantUseCase(repository),
        inject: [TENANT_REPOSITORY],
    },
];

@Module({
    imports: [TypeOrmModule.forFeature([Tenant, TenantUser, TenantConfig])],
    providers: [...repositories, ...useCases],
    controllers: [TenantController],
})
export class TenantModule { }
