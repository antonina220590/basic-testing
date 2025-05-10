// Uncomment the code below and write your tests

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosDefaults,
  AxiosInterceptorManager,
  InternalAxiosRequestConfig,
} from 'axios';
import { throttle as lodashThrottleOriginal } from 'lodash';
import { throttledGetDataFromApi } from './index';
type GetDataFromApiSignature = (relativePath: string) => Promise<unknown>;

jest.mock('axios');

jest.mock('lodash', () => {
  const originalLodash = jest.requireActual('lodash');
  return {
    ...originalLodash,
    throttle: jest.fn(
      (fn: GetDataFromApiSignature): GetDataFromApiSignature => {
        return fn;
      },
    ),
  };
});

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockAxiosGet: jest.Mock<Promise<AxiosResponse<unknown>>, [string]>;

  beforeEach(() => {
    mockedAxios.create.mockClear();
    const mockedLodashThrottle = lodashThrottleOriginal as jest.MockedFunction<
      typeof lodashThrottleOriginal
    >;
    mockedLodashThrottle.mockClear();

    mockAxiosGet = jest.fn().mockResolvedValue({
      data: 'default mock data',
    } as AxiosResponse<unknown>);
    const mockPartialAxiosInstance = {
      get: mockAxiosGet,
      defaults: { headers: {} } as AxiosDefaults,
      interceptors: {
        request: {
          use: jest.fn(),
          eject: jest.fn(),
          clear: jest.fn(),
        } as AxiosInterceptorManager<InternalAxiosRequestConfig>,
        response: {
          use: jest.fn(),
          eject: jest.fn(),
          clear: jest.fn(),
        } as AxiosInterceptorManager<AxiosResponse>,
      },
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      request: jest.fn(),
      getUri: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(
      mockPartialAxiosInstance as unknown as AxiosInstance,
    );
  });

  test('should create instance with provided base url', async () => {
    const relativePath = 'test/path';
    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledTimes(1);
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = 'users/1';
    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledTimes(1);
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(mockAxiosGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const expectedData = { id: 1, name: 'Leanne Graham' };
    mockAxiosGet.mockResolvedValue({ data: expectedData } as AxiosResponse<
      typeof expectedData
    >);

    const relativePath = 'users/1';
    const actualData = await throttledGetDataFromApi(relativePath);

    expect(actualData).toEqual(expectedData);
    expect(mockAxiosGet).toHaveBeenCalledWith(relativePath);
  });
});
