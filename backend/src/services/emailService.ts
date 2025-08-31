import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
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
    console.log('OTP email sent successfully to:', email);
  } catch (error: any) {
    console.error('Error sending OTP email:', error);
    
    // Handle specific email errors
    if (error.code === 'EENVELOPE' || error.responseCode === 550) {
      throw new Error('Email address does not exist or cannot receive emails');
    } else if (error.code === 'EAUTH') {
      throw new Error('Email service configuration error');
    } else {
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }
};