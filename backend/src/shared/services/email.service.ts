import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY || 're_mock_key');
const fromEmail = 'onboarding@resend.dev'; // Use your verified domain in production

export const sendRegisterEmail = async (email: string, otp: string) => {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to ApplyIQ! Verify your email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; text-align: center; }
            .content p { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 30px; }
            .otp-box { background-color: #000000; border: 1px solid #2563eb; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 30px; }
            .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #3b82f6; margin: 0; }
            .footer { padding: 20px; text-align: center; border-top: 1px solid #333333; background-color: #0a0a0a; }
            .footer p { font-size: 12px; color: #666666; margin: 0; }
            .button { display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
            .button:hover { background-color: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ApplyIQ ✨</h1>
            </div>
            <div class="content">
              <p>We're thrilled to have you on board! To ensure your account's security and unlock all features, please verify your email address using the code below.</p>
              
              <div class="otp-box">
                <h2 class="otp-code">${otp}</h2>
              </div>
              
              <p>This secure code will expire in 15 minutes. If you didn't create an account with ApplyIQ, you can safely ignore this email.</p>
              
              <a href="${env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}" class="button">Verify Email Now</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ApplyIQ. All rights reserved.</p>
              <p>You received this email because you signed up for an ApplyIQ account.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`Registration email sent to ${email}`);
  } catch (error) {
    console.error('Error sending registration email:', error);
  }
};

export const sendNewDeviceEmail = async (email: string, deviceAgent: string) => {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Security Alert: New Login Detected - ApplyIQ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; }
            .content { padding: 40px 30px; text-align: left; }
            .content p { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 20px; }
            .device-box { background-color: #1a1a1a; border-left: 4px solid #ef4444; border-radius: 4px 8px 8px 4px; padding: 20px; margin-bottom: 30px; }
            .device-box p { margin: 0; color: #e5e5e5; font-size: 14px; font-family: monospace; word-break: break-all; }
            .footer { padding: 20px; text-align: center; border-top: 1px solid #333333; background-color: #0a0a0a; }
            .footer p { font-size: 12px; color: #666666; margin: 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: transparent; border: 1px solid #ef4444; color: #ef4444; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; transition: all 0.2s; }
            .button:hover { background-color: #ef4444; color: #ffffff; }
            .action-wrapper { text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Security Alert</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>We noticed a new login to your ApplyIQ account from an unrecognized device or browser.</p>
              
              <div class="device-box">
                <p><strong>Device details:</strong><br><br>${deviceAgent}</p>
              </div>
              
              <p><strong>Was this you?</strong><br>If you recently logged into ApplyIQ from a new device, browser, or incognito window, you can safely ignore this email.</p>
              
              <p><strong>Not you?</strong><br>If you did not authorize this login, your account may be compromised. Please secure your account immediately by changing your password.</p>
              
              <div class="action-wrapper">
                <a href="${env.FRONTEND_URL}/dashboard/profile" class="button">Secure My Account</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ApplyIQ Security.</p>
              <p>Automated security notification. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`New device alert email sent to ${email}`);
  } catch (error) {
    console.error('Error sending new device email:', error);
  }
};

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Password Reset Request - ApplyIQ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; text-align: center; }
            .content p { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 30px; }
            .otp-box { background-color: #000000; border: 1px solid #2563eb; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 30px; }
            .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #3b82f6; margin: 0; }
            .footer { padding: 20px; text-align: center; border-top: 1px solid #333333; background-color: #0a0a0a; }
            .footer p { font-size: 12px; color: #666666; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ApplyIQ Password Reset 🔑</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your ApplyIQ password. Use the verification code below to securely reset your password:</p>
              
              <div class="otp-box">
                <h2 class="otp-code">${otp}</h2>
              </div>
              
              <p>This code will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ApplyIQ. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`Forgot password OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending forgot password OTP email:', error);
  }
};

export const sendPasswordChangeSuccessEmail = async (email: string) => {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Password Changed Successfully - ApplyIQ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; }
            .content { padding: 40px 30px; text-align: center; }
            .content p { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 20px; }
            .footer { padding: 20px; text-align: center; border-top: 1px solid #333333; background-color: #0a0a0a; }
            .footer p { font-size: 12px; color: #666666; margin: 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: transparent; border: 1px solid #10b981; color: #10b981; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; transition: all 0.2s; }
            .button:hover { background-color: #10b981; color: #ffffff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ApplyIQ Security ✅</h1>
            </div>
            <div class="content">
              <p>Your ApplyIQ account password has been successfully updated.</p>
              <p>You can now log in using your new credentials to access your dashboard.</p>
              
              <div style="margin-top: 30px;">
                <a href="${env.FRONTEND_URL}/login" class="button">Log In to ApplyIQ</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #999;">If you did not perform this action, please reset your password or contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ApplyIQ. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`Password change success email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password change success email:', error);
  }
};

export const sendWelcomeEmail = async (email: string, checkoutUrl: string) => {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to ApplyIQ! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; text-align: center; }
            .content p { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 30px; }
            .footer { padding: 20px; text-align: center; border-top: 1px solid #333333; background-color: #0a0a0a; }
            .footer p { font-size: 12px; color: #666666; margin: 0; }
            .button { display: inline-block; padding: 14px 28px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
            .button:hover { background-color: #7c3aed; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ApplyIQ! ✨</h1>
            </div>
            <div class="content">
              <p>Your email has been successfully verified! We're super excited to have you on board.</p>
              <p>To fully unlock the potential of your account and access our premium features, please proceed to your dashboard.</p>
              
              <a href="${checkoutUrl}" class="button">Go to Dashboard</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ApplyIQ. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
