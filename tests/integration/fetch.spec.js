import { describe, expect, it } from 'vitest';
import { fetchUrl, fetchHead } from '@/services/httpClient';
import { HTTP_STATUS } from '@/constants/httpStatus';

describe('HTTP Client', () => {
  it('fetch', async () => {
    const result = await fetchUrl('https://jsonplaceholder.typicode.com/posts/1');
    expect(result.httpStatus).toEqual(HTTP_STATUS.OK);
    expect(result.html).toBeTypeOf('string');
  });

  it('fetch with timeout', async () => {
    const result = await fetchUrl('https://jsonplaceholder.typicode.com/posts/1', 1);
    expect(result.httpStatus).toEqual(HTTP_STATUS.REQUEST_TIMEOUT);
  });

  it('head', async () => {
    const result = await fetchHead('https://jsonplaceholder.typicode.com/posts/1');
    expect(result).toEqual(HTTP_STATUS.OK);
  });

  it('head with timeout', async () => {
    const result = await fetchHead('https://jsonplaceholder.typicode.com/posts/1', 1);
    expect(result).toEqual(HTTP_STATUS.REQUEST_TIMEOUT);
  });

  it('head with bad request', async () => {
    const result = await fetchHead('https://jsonplaceholder.typicode.com/posts/1/123');
    expect(result).toEqual(HTTP_STATUS.NOT_FOUND);
  });
});
