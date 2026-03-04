import { addDays, diffInDays } from '../../src/shared/utils/date';
import { validatePasswordStrength } from '../../src/shared/utils/password';

describe('password utils', () => {
  it('should validate strong password', () => {
    expect(validatePasswordStrength('Strong@123')).toBe(true);
  });

  it('should reject weak password', () => {
    expect(validatePasswordStrength('12345678')).toBe(false);
  });
});

describe('date utils', () => {
  it('should add days', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    const result = addDays(base, 14);

    expect(result.toISOString()).toBe('2026-01-15T00:00:00.000Z');
  });

  it('should calculate late days', () => {
    const dueDate = new Date('2026-01-10T00:00:00.000Z');
    const returnDate = new Date('2026-01-13T12:00:00.000Z');

    expect(diffInDays(dueDate, returnDate)).toBe(3);
  });
});
