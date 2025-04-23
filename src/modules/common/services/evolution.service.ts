import { IWhatsAppService } from "../interfaces/whatsapp-service";

export class EvolutionService implements IWhatsAppService {
    private apiUrl = "https://evolution.kontact.com.br";
    private instanceName = "sorveteria_amigo";

    async sendMessage(message: string, number: string): Promise<void> {
        try {
            const response = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": ""
                },
                body: JSON.stringify({
                    number,
                    text: message
                })
            });


            const data = await response.json();
            console.log("Resposta da API:", data);

            if (!response.ok) {
                console.error(`Erro ao enviar mensagem: ${response.statusText}`);
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }
}
