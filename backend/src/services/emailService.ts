import nodemailer from 'nodemailer';
import https from 'https';

const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
const isSecurePort = emailPort === 465;
const emailHost = process.env.EMAIL_HOST?.trim();
const emailUser = process.env.EMAIL_USER?.trim();
// Gmail app passwords are often copied with spaces (e.g., "abcd efgh ijkl mnop").
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
const resendApiKey = process.env.RESEND_API_KEY?.trim();
const emailFrom = process.env.EMAIL_FROM?.trim() || emailUser;

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

const sendViaResend = async (to: string, subject: string, html: string): Promise<void> => {
  if (!resendApiKey || !emailFrom) {
    throw new Error('Resend configuration is incomplete. Set RESEND_API_KEY and EMAIL_FROM.');
  }

  const payload = JSON.stringify({
    from: emailFrom,
    to: [to],
    subject,
    html,
  });

  await new Promise<void>((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 20000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }
          reject(
            new Error(
              `Resend API failed with status ${res.statusCode}: ${body || 'No response body'}`
            )
          );
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('Resend API request timed out'));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const subject = 'Your OTP for Note Taking App';
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Note Taking App Verification</h2>
        <p>Your OTP for verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

  // Prefer HTTPS API delivery in production (more reliable on PaaS than SMTP ports).
  if (resendApiKey) {
    try {
      await sendViaResend(email, subject, html);
      return;
    } catch (resendError: any) {
      console.error('Resend sendMail failed', {
        message: resendError?.message,
      });
    }
  }

  if (!emailHost || !emailUser || !emailPass) {
    throw new Error('Email service configuration is incomplete. Set RESEND_API_KEY + EMAIL_FROM, or SMTP variables.');
  }

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject,
    html,
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