import nodemailer from 'nodemailer';

const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
const isSecurePort = emailPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort,
  secure: isSecurePort,
  requireTLS: !isSecurePort,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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
    console.error('SMTP sendMail failed', {
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      message: error?.message,
    });

    if (error.code === 'EENVELOPE' || error.responseCode === 550) {
      throw new Error('Email address does not exist or cannot receive emails');
    } else if (error.code === 'EAUTH') {
      throw new Error('Email service authentication failed. Check EMAIL_USER and EMAIL_PASS (App Password).');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      throw new Error('Email service is unreachable. Check EMAIL_HOST, EMAIL_PORT, and network access.');
    } else {
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }
};