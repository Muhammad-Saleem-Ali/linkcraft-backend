import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { pool } from './db/index.js';
import authRoutes from './routes/authRoutes.js';
import linksRoutes from './routes/linksRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import realtimeRoutes from './routes/realtimeRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import { handleRedirect } from './controllers/linksController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Enable CORS for all origins in development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// Direct short redirect route (e.g. /r/:slug)
app.get('/r/:slug', handleRedirect);
// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const dbRes = await pool.query('SELECT NOW() as current_time, version()');
        res.json({
            status: 'healthy',
            service: 'iLearner Affiliate Engine API',
            timestamp: new Date(),
            database: {
                connected: true,
                postgresTime: dbRes.rows[0].current_time,
            },
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'unhealthy',
            error: err.message,
        });
    }
});
// Amazon Creators API diagnostics status
app.get('/api/amazon/status', async (req, res) => {
    try {
        const { testAmazonCredentials } = await import('./utils/amazonCreatorsApi.js');
        const status = await testAmazonCredentials();
        res.json({ success: true, ...status });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/whatsapp', whatsappRoutes);
// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route ${req.method} ${req.url} not found` });
});
// Global error handler
app.use(errorHandler);
// Start server
app.listen(PORT, async () => {
    console.log(`===============================================`);
    console.log(`🚀 iLearner Affiliate Backend running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Real-time SSE: http://localhost:${PORT}/api/realtime`);
    console.log(`===============================================`);
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        client.release();

        // Run migrations and initial seed automatically
        await runMigrations();
        await seedDatabase();
        console.log('✅ Database schema verified & up-to-date');
    }
    catch (err) {
        console.error('❌ Database connection or migration error:', err);
    }
});
export default app;
