import { Router } from 'express';
import { getOverviewStats, getChartData, getEarnings, getPayouts, requestPayout, updateProfile, generatePairingCode, getLinkedWhatsAppAccounts, deleteLinkedWhatsAppAccount, } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/stats', getOverviewStats);
router.get('/chart', getChartData);
router.get('/earnings', getEarnings);
router.get('/payouts', getPayouts);
router.post('/payouts/request', requestPayout);
router.put('/profile', updateProfile);
router.post('/pairing-code', generatePairingCode);
router.get('/whatsapp/accounts', getLinkedWhatsAppAccounts);
router.delete('/whatsapp/accounts/:id', deleteLinkedWhatsAppAccount);
export default router;
