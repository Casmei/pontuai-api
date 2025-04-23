import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/common/interfaces/usecase';
import { ITenantRepository } from '../interfaces/tenant.repository';
import { UpdateTenantSettingsDto } from '../_infra/http/Dtos/update-tenant-settings.dto';
import { Tenant } from '../entities/tenant.entity';
import { JwtPayload } from 'src/modules/auth/types/auth.types';

type Output = Either<void | null, Error>;

export class UpdateTenantSettingsUseCase
    implements
    Usecase<
        { data: UpdateTenantSettingsDto; tenantId: string; user: JwtPayload },
        Output
    > {
    constructor(private tenantRepository: ITenantRepository) { }

    async execute(input: {
        data: UpdateTenantSettingsDto;
        tenantId: string;
        user: JwtPayload
    }): Promise<Output> {
        try {
            if (!await this.tenantRepository.isTenantOwner(input.user, input.tenantId)) {
                throw new Error('This user does not have permission to update the settings');
            }

            await this.tenantRepository.updateSettings(input.data, input.tenantId);
            return Right.of(null);
        } catch (error) {
            console.log(error);
            return Left.of(new Error('Failed to get tenant'));
        }
    }
}
