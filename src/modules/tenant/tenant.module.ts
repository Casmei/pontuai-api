import { Module } from "@nestjs/common";
import { TenantController } from "./_infra/http/tenant.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./entities/tenant.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    controllers: [TenantController],
})
export class TenantModule { }
