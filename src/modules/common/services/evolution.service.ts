import { WhatsappConfig } from "src/modules/tenant/entities/tenant-config";
import { IWhatsAppService } from "../interfaces/whatsapp-service";

export class EvolutionService implements IWhatsAppService {
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
            const response = await fetch(`${this.baseUrl}/message/sendText/${this.instanceName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": this.apikey
                },
                body: JSON.stringify({
                    number,
                    text: message
                })
            });

            const data = await response.json();

            console.log("aaa: ", data)

            if (!response.ok) {
                console.error(`Erro ao enviar mensagem: ${response.statusText}`);
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }
}
