// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const testValue = 'hello! hi!';
    await expect(resolveValue(testValue)).resolves.toBe(testValue);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const testMsg = 'Error Message';
    expect(() => throwError(testMsg)).toThrow(testMsg);
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultMsg = 'Oops!';
    expect(() => throwError()).toThrow(defaultMsg);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
