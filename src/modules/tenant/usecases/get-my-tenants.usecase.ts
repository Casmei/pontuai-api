import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import { ITenantRepository } from '../interfaces/tenant.repository';
import { Tenant } from '../entities/tenant.entity';

type Output = Either<Tenant[] | null, Error>;

export class GetMyTenants implements Usecase<{ user: JwtPayload }, Output> {
    constructor(
        private tenantRepository: ITenantRepository
    ) { }

    async execute(input: { user: JwtPayload }): Promise<Output> {
        try {
            const tenant = await this.tenantRepository.getByUserId(input.user);
            return Right.of(tenant);
        } catch (error) {
            console.log(error);
            return Left.of(new Error('Failed to get tenant'));
        }
    }
}
