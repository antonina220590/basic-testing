// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedJoin = join as jest.MockedFunction<typeof join>;

describe('doStuffByTimeout', () => {
  let setTimeoutSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    setTimeoutSpy.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const timeoutDuration = 500;
    doStuffByTimeout(mockCallback, timeoutDuration);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(
      mockCallback,
      timeoutDuration,
    );
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn();
    const timeoutDuration = 500;

    doStuffByTimeout(mockCallback, timeoutDuration);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeoutDuration / 2);
    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeoutDuration / 2);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let setIntervalSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    setIntervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    setIntervalSpy.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const intervalDuration = 500;

    doStuffByInterval(mockCallback, intervalDuration);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenLastCalledWith(
      mockCallback,
      intervalDuration,
    );
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    const intervalDuration = 500;

    doStuffByInterval(mockCallback, intervalDuration);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(intervalDuration);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(intervalDuration);
    expect(mockCallback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(intervalDuration * 3);
    expect(mockCallback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    mockedExistsSync.mockClear();
    mockedReadFile.mockClear();
    mockedJoin.mockClear();
  });
  test('should call join with pathToFile', async () => {
    const pathToFile = 'dummy/path.txt';
    const expectedFullPath = '/mocked/full/path/to/dummy/path.txt';
    mockedJoin.mockReturnValue(expectedFullPath);
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(mockedJoin).toHaveBeenCalledTimes(1);

    expect(mockedJoin).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';
    const fullPath = '/test/nonexistent.txt';

    mockedJoin.mockReturnValue(fullPath);
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(mockedExistsSync).toHaveBeenCalledWith(fullPath);
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existent.txt';
    const fullPath = '/test/existent.txt';
    const fileContentString = 'Hello, Jest!';
    const fileContentBuffer = Buffer.from(fileContentString);

    mockedJoin.mockReturnValue(fullPath);
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(fileContentBuffer);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContentString);
    expect(mockedExistsSync).toHaveBeenCalledWith(fullPath);
    expect(mockedReadFile).toHaveBeenCalledWith(fullPath);
  });
});
