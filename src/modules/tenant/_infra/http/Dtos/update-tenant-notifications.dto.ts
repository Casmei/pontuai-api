import { IsString } from 'class-validator';

export class UpdateTenantNotificationsDto {
  @IsString()
  customerNew: string;

  @IsString()
  transactionAddPoints: string;

  @IsString()
  transactionRedeemPoints: string;

  @IsString()
  transactionExpirePoints1Days: string;

  @IsString()
  transactionExpirePoints3Days: string;

  @IsString()
  transactionExpirePoints7Days: string;
}
