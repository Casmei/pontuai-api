import { Either, Left, Right } from 'src/_utils/either';
import { Usecase } from 'src/modules/@shared/interfaces/usecase';
import { WhatsappNotificationMapResponse } from '../_infra/http/Responses/get-tenant-notifications.response';
import { ITenantRepository } from '../interfaces/tenant.repository';

type Output = Either<WhatsappNotificationMapResponse | null, Error>;
type Input = { tenantId: string };

export class GetTenantNotificationsUseCase
  implements Usecase<{ tenantId: string }, Output>
{
  constructor(private tenantRepository: ITenantRepository) {}

  async execute({ tenantId }: Input): Promise<Output> {
    try {
      const tenantConfig =
        await this.tenantRepository?.getTenantConfig(tenantId);

      if (!tenantConfig) {
        throw new Error('Tenant config não encontrado');
      }

      const { whatsapp_notification } = tenantConfig;

      return Right.of(whatsapp_notification);
    } catch (error) {
      console.log(error);
      return Left.of(new Error('Failed to get tenant'));
    }
  }
}
