import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import CreateTenantDto from '../_infra/http/Dtos/create-tenant.dto';
import { CreateTenantResponse } from '../_infra/http/Responses/create-tenant.response';
import { ITenantRepository } from '../interfaces/tenant.repository';

type Output = Either<CreateTenantResponse, Error>;

export class CreateTenantUseCase
  implements Usecase<{ data: CreateTenantDto; user: JwtPayload }, Output>
{
  constructor(private tenantRepository: ITenantRepository) {}

  async execute(input: {
    data: CreateTenantDto;
    user: JwtPayload;
  }): Promise<Output> {
    try {
      const tenant = await this.tenantRepository.create(input.data);
      await this.tenantRepository.generateDefaultTenantConfig(tenant);
      await this.tenantRepository.assignUser(input.user, tenant);

      return Right.of(tenant);
    } catch (error) {
      return Left.of(new Error(error.message));
    }
  }
}
