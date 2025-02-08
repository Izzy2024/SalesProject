// src/controllers/whatsappController.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class WhatsAppController {
    constructor() {
        this.apiVersion = 'v17.0';
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
    }

    // Enviar mensaje de texto simple
    async sendTextMessage(to, message) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: to,
                    type: "text",
                    text: { body: message }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            throw error;
        }
    }

    // Enviar mensaje con plantilla
    async sendTemplateMessage(to, templateName, languageCode, components = []) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "template",
                    template: {
                        name: templateName,
                        language: {
                            code: languageCode
                        },
                        components: components
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending template message:', error.response?.data || error.message);
            throw error;
        }
    }

    // Enviar mensaje con producto
    async sendProductMessage(to, productId, catalogId) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "interactive",
                    interactive: {
                        type: "product",
                        body: {
                            text: "¿Te gustaría comprar este producto?"
                        },
                        action: {
                            catalog_id: catalogId,
                            product_retailer_id: productId
                        }
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending product message:', error.response?.data || error.message);
            throw error;
        }
    }

    // Manejar webhooks de WhatsApp
    handleWebhook(body) {
        try {
            const { entry } = body;
            
            for (const e of entry) {
                const changes = e.changes;
                for (const change of changes) {
                    const value = change.value;
                    if (value.messages) {
                        return this.processIncomingMessage(value.messages[0]);
                    }
                }
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
            throw error;
        }
    }

    // Procesar mensajes entrantes
    async processIncomingMessage(message) {
        const messageType = message.type;
        const from = message.from;

        switch (messageType) {
            case 'text':
                return {
                    type: 'text',
                    from,
                    content: message.text.body
                };
            case 'interactive':
                return {
                    type: 'interactive',
                    from,
                    content: message.interactive
                };
            default:
                return {
                    type: 'unsupported',
                    from,
                    content: `Mensaje de tipo ${messageType} no soportado`
                };
        }
    }
}

export default WhatsAppController;