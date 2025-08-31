import speakeasy from 'speakeasy';

export const generateOTP = (): string => {
  return speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    digits: 6,
    step: 300, // 5 minutes
  });
};

export const verifyOTP = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    step: 300, // 5 minutes
    window: 1,
  });
};