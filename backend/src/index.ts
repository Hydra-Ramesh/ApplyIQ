import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import resumeRoutes from './modules/resume/resume.routes';
import adminRoutes from './modules/admin/admin.routes';
import templateRoutes from './modules/admin/template.routes';
import stripeRoutes from './modules/stripe/stripe.routes';
import publicRoutes from './modules/public/public.routes';
import notificationRoutes from './modules/notification/notification.routes';
import { errorHandler } from './shared/middlewares/errorHandler';
import { env } from './shared/config/env';
import { initSocketServer } from './socket';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Must come before routes)
app.use(cors({ origin: [env.FRONTEND_URL, 'https://apply-iq-vozm.vercel.app'], credentials: true }));
app.use(helmet());
app.use(morgan('dev'));

// Mount Stripe Routes (must come before express.json to preserve raw body for webhooks)
app.use('/api/stripe', stripeRoutes);

// JSON body parser (must come AFTER stripe routes)
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' }
});

// Basic Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Routes
app.use('/api/auth', limiter, authRoutes);
app.use('/api/profile', limiter, profileRoutes);
app.use('/api/resumes', limiter, resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

// Database connection
mongoose.connect(env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start main API server
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
    // Start Socket.IO on 5001
    initSocketServer(5001);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
