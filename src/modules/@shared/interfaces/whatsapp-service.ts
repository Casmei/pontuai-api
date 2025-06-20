import { WhatsappConfig } from 'src/modules/tenant/entities/tenant-config';

export const WHATSAPP_SERVICE = 'WHATSAPP_SERVICE';

export interface IWhatsAppService {
  configureForTenant(config?: WhatsappConfig): void;
  sendMessage(message: string, number: string): Promise<void>;
}
