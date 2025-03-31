import { Body, Controller, Post } from "@nestjs/common";

@Controller('tenant')
export class TenantController {

    @Post()
    create() {
        console.log("entrou aqui");
    }
}