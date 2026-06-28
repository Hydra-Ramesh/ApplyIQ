import express, { Router } from 'express';
import { stripeController } from './stripe.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Create Checkout Session requires a logged in user
router.post('/create-checkout-session', express.json(), authenticate, stripeController.createCheckoutSession);

// Create Portal Session requires a logged in user
router.post('/create-portal-session', express.json(), authenticate, stripeController.createPortalSession);

// Webhook MUST have the raw body (no JSON parsing) to verify the stripe signature
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.handleWebhook);

export default router;
