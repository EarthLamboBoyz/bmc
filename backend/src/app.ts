import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import campaignRoutes from './routes/campaign.routes';
import applicationRoutes from './routes/application.routes';
import submissionRoutes from './routes/submission.routes';
import uploadRoutes from './routes/upload.routes';
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';
import gmvRoutes from './routes/gmv.routes';
import testRoutes from './routes/test.routes';
import rewardCalcRoutes from './routes/rewardCalculation.routes';
import creatorCampaignRoutes from './routes/creatorCampaign.routes';

const app = express();

// ============================================
// Security Middleware
// ============================================
app.set('trust proxy', 1); // Trust first proxy (Railway)
app.use(helmet());

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: true, // Allow all origins explicitly
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// Health Check (for Docker / Load Balancer)
// ============================================
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/gmv', gmvRoutes);
app.use('/api/rewards', rewardCalcRoutes);
app.use('/api/creator', creatorCampaignRoutes);

// Test routes — only in development
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/test', testRoutes);
}

app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'BrandMeetCreator API is running 🚀' });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err.message);
    console.error(err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

export default app;
