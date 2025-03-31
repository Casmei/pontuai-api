import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { Tenant } from '../entities/tenant.entity';
import CreateTenantDto from '../_infra/http/Dtos/create-tenant.dto';
import { TenantRepository } from '../_infra/database/tenant-typeorm.repository';

type Output = Either<Tenant, Error>;

export class CreateTenantUseCase implements Usecase<CreateTenantDto, Output> {
    constructor(
        private tenantRepository: TenantRepository,
    ) { }

    async execute(input: CreateTenantDto): Promise<Output> {
        try {
            const result = await this.tenantRepository.create(input);
            return Right.of(result);
        } catch (error) {
            console.log(error);
            return Left.of(new Error('Failed to create customer'));
        }
    }
}
