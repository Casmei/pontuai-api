import { Body, Controller, Post } from "@nestjs/common";
import CreateTenantDto from "./Dtos/create-tenant.dto";

@Controller('tenant')
export class TenantController {
    constructor() { }

    @Post()
    async create() {
        console.log("entrou aqui");
    }
}
