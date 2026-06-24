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
import { errorHandler } from './shared/middlewares/errorHandler';
import { env } from './shared/config/env';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: [env.FRONTEND_URL, 'http://localhost:5173'], credentials: true }));
app.use(helmet());
app.use(morgan('dev'));

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

// Global Error Handler
app.use(errorHandler);

// Database connection
mongoose.connect(env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
