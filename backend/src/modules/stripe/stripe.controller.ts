import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { env } from '../../shared/config/env';
import User from '../auth/user.model';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-06-24.dahlia',
});

export class StripeController {
  async createCheckoutSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const returnUrl = req.body?.returnUrl;
      const userId = req.user!.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.subscriptionTier === 'pro') {
        return res.status(400).json({ message: 'User is already subscribed to Pro' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        client_reference_id: userId.toString(),
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'ApplyIQ Pro',
                description: 'Unlock unlimited PDF exports, elite AI Copilot, and priority support.',
              },
              unit_amount: 1900, // $19.00
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: returnUrl 
          ? (returnUrl.includes('?') ? `${returnUrl}&checkout=success` : `${returnUrl}?checkout=success`) 
          : `${env.FRONTEND_URL}/dashboard?checkout=success`,
        cancel_url: returnUrl || `${env.FRONTEND_URL}/dashboard?checkout=cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      // req.body MUST be the raw buffer here, otherwise signature verification fails.
      event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            subscriptionTier: 'pro',
            stripeCustomerId: customerId,
          });
          console.log(`[Stripe Webhook] Upgraded user ${userId} to Pro.`);
        }
      } 
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await User.findOneAndUpdate(
          { stripeCustomerId: customerId },
          { subscriptionTier: 'free' }
        );
        console.log(`[Stripe Webhook] Downgraded customer ${customerId} to Free.`);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.status(200).send();
    } catch (error) {
      console.error('Webhook handler failed:', error);
      res.status(500).send('Webhook handler failed');
    }
  }

  async createPortalSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await User.findById(userId);
      
      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ message: 'User does not have an active subscription' });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${env.FRONTEND_URL}/dashboard/settings`,
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      next(error);
    }
  }
}

export const stripeController = new StripeController();
