import { validateEmail, validatePassword } from '../../utils/auth';

describe('Auth Utilities', () => {
  describe('validateEmail', () => {
    test('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should return true for valid password', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('SecurePass1')).toBe(true);
    });

    test('should return false for invalid password', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('nodigits')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });
}); 