import { Module, Provider } from "@nestjs/common";
import { TenantController } from "./_infra/http/tenant.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./entities/tenant.entity";
import { TENANT_REPOSITORY } from "./interfaces/tenant.repository";
import { TenantRepository } from "./_infra/database/tenant-typeorm.repository";
import { CreateTenantUseCase } from "./usecases/create-tenant";

const repositories: Provider[] = [
    {
        provide: TENANT_REPOSITORY,
        useClass: TenantRepository,
    },
];

const useCases: Provider[] = [
    {
        provide: CreateTenantUseCase,
        useFactory: (repository: TenantRepository) =>
            new CreateTenantUseCase(repository),
        inject: [TENANT_REPOSITORY],
    },
];

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    providers: [...repositories, ...useCases],
    controllers: [TenantController],
})
export class TenantModule { }
