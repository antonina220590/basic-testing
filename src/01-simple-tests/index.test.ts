// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const inputForAdd = { a: 2, b: 2, action: Action.Add };
    const expectedResult = 4;
    const actualResult = simpleCalculator(inputForAdd);
    expect(actualResult).toBe(expectedResult);
  });

  test('should subtract two numbers', () => {
    const inputForSubtract = { a: 5, b: 2, action: Action.Subtract };
    const expectedResult = 3;

    const actualResult = simpleCalculator(inputForSubtract);
    expect(actualResult).toBe(expectedResult);
  });

  test('should multiply two numbers', () => {
    const inputForMultiply = { a: 2, b: 2, action: Action.Multiply };
    const expectedResult = 4;

    const actualResult = simpleCalculator(inputForMultiply);
    expect(actualResult).toBe(expectedResult);
  });

  test('should divide two numbers', () => {
    const inputForDivide = { a: 20, b: 2, action: Action.Divide };
    const expectedResult = 10;

    const actualResult = simpleCalculator(inputForDivide);
    expect(actualResult).toBe(expectedResult);
  });

  test('should exponentiate two numbers', () => {
    const inputForExponentiate = { a: 2, b: 2, action: Action.Exponentiate };
    const expectedResult = 4;

    const actualResult = simpleCalculator(inputForExponentiate);
    expect(actualResult).toBe(expectedResult);
  });

  test('should return null for invalid action', () => {
    const inputWithInvalidAction = {
      a: 5,
      b: 3,
      action: 'invalid_operation_string',
    };
    const actualResult = simpleCalculator(inputWithInvalidAction);
    expect(actualResult).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const inputWithInvalidArgs = {
      a: 'invalid_a',
      b: 'invalid_b',
      action: Action.Divide,
    };

    const actualResult = simpleCalculator(inputWithInvalidArgs);
    expect(actualResult).toBeNull();
  });
});
