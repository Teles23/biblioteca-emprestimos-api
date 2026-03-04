import { randomBytes } from 'crypto';

export function validatePasswordStrength(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  return regex.test(password);
}

export function generateRandomPassword(): string {
  const seed = randomBytes(12).toString('base64url');
  return `Aa1!${seed}`;
}
