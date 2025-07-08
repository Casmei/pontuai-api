import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { UpdateTenantNotificationsDto } from '../_infra/http/Dtos/update-tenant-notifications.dto';
import { WhatsappNotificationMapResponse } from '../_infra/http/Responses/get-tenant-notifications.response';
import { ITenantRepository } from '../interfaces/tenant.repository';

type Output = Either<WhatsappNotificationMapResponse | null, Error>;
type Input = { tenantId: string; data: UpdateTenantNotificationsDto };

export class UpdateTenantNotificationsUseCase
  implements Usecase<{ tenantId: string }, Output>
{
  constructor(private tenantRepository: ITenantRepository) {}

  async execute({ tenantId, data }: Input): Promise<Output> {
    try {
      //TODO: melhorar e muito as validações de váriavéis aqui
      await this.tenantRepository.updateNotifications(tenantId, data);

      return Right.of(null);
    } catch (error) {
      console.error(error);
      return Left.of(new Error('Failed to update tenant notifications'));
    }
  }
}
