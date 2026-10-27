import { Router } from 'express';
import { getAdminOverview, getAllUsers, updateUserStatus, updateUserCommission, getPlatformReports, getAllPayouts, processPayout, getAllLinks, importAmazonOrders, } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();
// Middleware: allow only authenticated admin access
router.use(requireAdmin);
router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/commission', updateUserCommission);
router.get('/reports', getPlatformReports);
router.post('/reports/import', importAmazonOrders);
router.get('/payouts', getAllPayouts);
router.post('/payouts/:id/pay', processPayout);
router.get('/links', getAllLinks);
export default router;
