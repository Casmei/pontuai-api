export const WHATSAPP_SERVICE = 'WHATSAPP_SERVICE';

export interface IWhatsAppService {
    sendMessage(message: string, number: string): Promise<void>;
}
