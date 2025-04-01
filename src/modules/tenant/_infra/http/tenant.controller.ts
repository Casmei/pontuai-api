import { Body, Controller, Post } from "@nestjs/common";
import { GetUser } from "src/modules/auth/decorators/get-user.decorator";
import { JwtPayload } from "src/modules/auth/types/auth.types";
import CreateTenantDto from "./Dtos/create-tenant.dto";
import { CreateTenantUseCase } from "../../usecases/create-tenant";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateTenantResponse } from '../http/Responses/create-tenant.response';


@Controller('tenant')
export class TenantController {
    constructor(private createTenantUseCase: CreateTenantUseCase) { }

    @Post()
    @ApiOperation({ summary: 'Create a new tenant' })
    @ApiResponse({
        status: 201,
        description: 'The tenant has been successfully created',
        type: CreateTenantResponse
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@GetUser() user: JwtPayload, @Body() data: CreateTenantDto) {
        const result = await this.createTenantUseCase.execute({ data, user });

        if (result.isRight()) {
            return result.value;
        }
    }
}