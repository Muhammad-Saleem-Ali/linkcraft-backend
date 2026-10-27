import { Router } from 'express';
import { verifyMetaWebhook, handleMetaWebhook, handleTwilioWebhook, simulateIncomingMessage, } from '../controllers/whatsappController.js';
const router = Router();
// 1. Meta WhatsApp Cloud API Webhook
router.get('/webhook', verifyMetaWebhook);
router.post('/webhook', handleMetaWebhook);
// 2. Twilio WhatsApp API Webhook
router.post('/twilio', handleTwilioWebhook);
// 3. Testing & Simulation endpoint
router.post('/test-simulate', simulateIncomingMessage);
export default router;
