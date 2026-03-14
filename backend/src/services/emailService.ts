import nodemailer from 'nodemailer';

const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
const isSecurePort = emailPort === 465;
const emailHost = process.env.EMAIL_HOST?.trim();
const emailUser = process.env.EMAIL_USER?.trim();
// Gmail app passwords are often copied with spaces (e.g., "abcd efgh ijkl mnop").
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

const createTransporter = (port: number, secure: boolean) => nodemailer.createTransport({
  host: emailHost,
  port,
  secure,
  requireTLS: !secure,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const transporter = createTransporter(emailPort, isSecurePort);

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  if (!emailHost || !emailUser || !emailPass) {
    throw new Error('Email service configuration is incomplete. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS.');
  }

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: 'Your OTP for Note Taking App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Note Taking App Verification</h2>
        <p>Your OTP for verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    if (error?.code === 'ETIMEDOUT' && emailPort === 587) {
      try {
        const fallbackTransporter = createTransporter(465, true);
        await fallbackTransporter.sendMail(mailOptions);
        return;
      } catch (fallbackError: any) {
        console.error('SMTP fallback sendMail failed', {
          code: fallbackError?.code,
          responseCode: fallbackError?.responseCode,
          command: fallbackError?.command,
          message: fallbackError?.message,
        });
      }
    }

    console.error('SMTP sendMail failed', {
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      message: error?.message,
    });

    if (error.code === 'EENVELOPE' || error.responseCode === 550) {
      throw new Error('Email address does not exist or cannot receive emails');
    } else if (error.code === 'EAUTH') {
      throw new Error('Email service authentication failed. Use a Gmail App Password (no spaces) in EMAIL_PASS.');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      throw new Error('Email service is unreachable. Check EMAIL_HOST, EMAIL_PORT, and network access.');
    } else {
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }
};