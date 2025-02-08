// src/routes/whatsapp.js
import express from 'express';
import WhatsAppController from '../controllers/whatsappController.js';

const router = express.Router();
const whatsappController = new WhatsAppController();

// Webhook para verificación de WhatsApp
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log('Webhook verificado');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Webhook para recibir mensajes
router.post('/webhook', async (req, res) => {
    try {
        const response = await whatsappController.handleWebhook(req.body);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

// Enviar mensaje de texto
router.post('/send-message', async (req, res) => {
    try {
        const { to, message } = req.body;
        const response = await whatsappController.sendTextMessage(to, message);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enviar mensaje con plantilla
router.post('/send-template', async (req, res) => {
    try {
        const { to, templateName, languageCode, components } = req.body;
        const response = await whatsappController.sendTemplateMessage(
            to, 
            templateName, 
            languageCode, 
            components
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enviar mensaje de producto
router.post('/send-product', async (req, res) => {
    try {
        const { to, productId, catalogId } = req.body;
        const response = await whatsappController.sendProductMessage(
            to, 
            productId, 
            catalogId
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;