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
        <h1>Welcome to ApplyIQ!</h1>
        <p>Thank you for registering. Please verify your email address using the OTP below:</p>
        <h2 style="font-size: 24px; letter-spacing: 2px; color: #2563eb;">${otp}</h2>
        <p>This OTP will expire in 15 minutes.</p>
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
      subject: 'New Device Login Alert - ApplyIQ',
      html: `
        <h1>New Login Detected</h1>
        <p>We noticed a new login to your ApplyIQ account from an unrecognized device.</p>
        <p><strong>Device Info:</strong> ${deviceAgent}</p>
        <p>If this was you, you can safely ignore this email.</p>
        <p>If you did not authorize this login, please reset your password immediately.</p>
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
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        <h2 style="font-size: 24px; letter-spacing: 2px; color: #dc2626;">${otp}</h2>
        <p>This OTP will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
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
      subject: 'Password Changed Successfully - ResumeAI Pro',
      html: `
        <h1>Password Changed Successfully</h1>
        <p>Your ResumeAI Pro account password has been successfully updated.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
      `
    });
    console.log(`Password change success email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password change success email:', error);
  }
};
