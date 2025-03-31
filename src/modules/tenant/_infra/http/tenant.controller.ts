import { Body, Controller, Post } from "@nestjs/common";
import { GetUser } from "src/modules/auth/decorators/get-user.decorator";
import { JwtPayload } from "src/modules/auth/types/auth.types";
import CreateTenantDto from "./Dtos/create-tenant.dto";
import { CreateTenantUseCase } from "../../usecases/create-tenant";

@Controller('tenant')
export class TenantController {
    constructor(private createTenantUseCase: CreateTenantUseCase) { }

    @Post()
    async create(@GetUser() user: JwtPayload, @Body() createTenantDto: CreateTenantDto) {
        //Todo: Implementar relacionamento entre usuário e tenant
        console.log(user);
        return await this.createTenantUseCase.execute(createTenantDto);
    }
}