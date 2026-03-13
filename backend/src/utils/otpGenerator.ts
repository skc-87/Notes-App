import speakeasy from 'speakeasy';

export const generateOTP = (): string => {
  return speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    digits: 6,
    step: 300,
  });
};
