// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalledWith('foo');
    expect(consoleSpy).not.toHaveBeenCalledWith('bar');
    expect(consoleSpy).not.toHaveBeenCalledWith('baz');
  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction();
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
  });
});
