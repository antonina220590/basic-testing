// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  random: jest.fn(),
}));

const mockedRandom = random as jest.MockedFunction<typeof random>;

describe('BankAccount', () => {
  beforeEach(() => {
    mockedRandom.mockClear();
  });
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const accountFrom = getBankAccount(50);
    const accountTo = getBankAccount(0);
    expect(() => accountFrom.transfer(100, accountTo)).toThrow(
      InsufficientFundsError,
    );
    expect(accountFrom.getBalance()).toBe(50);
    expect(accountTo.getBalance()).toBe(0);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    account.withdraw(30);
    expect(account.getBalance()).toBe(70);
  });

  test('should transfer money', () => {
    const accountFrom = getBankAccount(200);
    const accountTo = getBankAccount(50);
    accountFrom.transfer(100, accountTo);
    expect(accountFrom.getBalance()).toBe(100);
    expect(accountTo.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(0);
    const expectedBalance = 75;
    mockedRandom.mockReturnValueOnce(expectedBalance);
    mockedRandom.mockReturnValueOnce(1);

    const balance = await account.fetchBalance();
    expect(balance).toBe(expectedBalance);
    expect(mockedRandom).toHaveBeenCalledTimes(2);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(10);
    const newFetchedBalance = 150;
    const fetchBalanceSpy = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(newFetchedBalance);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(newFetchedBalance);

    fetchBalanceSpy.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(10);
    const initialBalance = account.getBalance();
    const fetchBalanceSpy = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    expect(account.getBalance()).toBe(initialBalance);

    fetchBalanceSpy.mockRestore();
  });
});
