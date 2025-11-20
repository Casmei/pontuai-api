import { WhatsappConfig } from "src/modules/tenant/entities/tenant-config.entity";
import { IWhatsAppService } from "../interfaces/whatsapp-service";

export class UazapiService implements IWhatsAppService {
  private baseUrl: string;
  private instanceName: string;
  private apikey: string;

  configureForTenant(config?: WhatsappConfig): void {
    if (config) {
      this.baseUrl = config.baseUrl;
      this.apikey = config.apikey;
      this.instanceName = config.instanceName;
    }
  }

  async sendMessage(message: string, number: string): Promise<void> {
    if (!this.instanceName || !this.apikey) {
      console.error("WhatsApp não configurado para este tenant");
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/send/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: this.apikey,
        },
        body: JSON.stringify({
          number,
          text: message,
        }),
      });

      if (!response.ok) {
        console.error(`Erro ao enviar mensagem: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }
}
