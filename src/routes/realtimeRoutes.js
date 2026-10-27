import { Router } from 'express';
import { realtimeHub } from '../utils/realtime.js';
const router = Router();
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    realtimeHub.registerClient(res);
});
export default router;
