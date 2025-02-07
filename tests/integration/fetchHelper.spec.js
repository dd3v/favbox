import { describe, expect, it } from 'vitest';
import fetchHelper from '@/helpers/fetch';
import { HTTP_STATUS } from '@/helpers/httpStatus';

describe('Test tag helper', () => {
  it('ping server', async () => {
    const result = await fetchHelper.ping();
    expect(result).toEqual(true);
  });

  it('fetch', async () => {
    const result = await fetchHelper.fetch('https://jsonplaceholder.typicode.com/posts/1');
    expect(result.httpStatus).toEqual(HTTP_STATUS.OK);
    expect(result.html).toBeTypeOf('string');
  });

  it('fetch with timeout', async () => {
    const result = await fetchHelper.fetch('https://jsonplaceholder.typicode.com/posts/1', 1);
    expect(result.httpStatus).toEqual(HTTP_STATUS.REQUEST_TIMEOUT);
  });

  it('head', async () => {
    const result = await fetchHelper.head('https://jsonplaceholder.typicode.com/posts/1');
    expect(result).toEqual(HTTP_STATUS.OK);
  });

  it('head with timeout', async () => {
    const result = await fetchHelper.head('https://jsonplaceholder.typicode.com/posts/1', 1);
    expect(result).toEqual(HTTP_STATUS.REQUEST_TIMEOUT);
  });

  it('head with bad request', async () => {
    const result = await fetchHelper.head('https://jsonplaceholder.typicode.com/posts/1/123');
    expect(result).toEqual(HTTP_STATUS.NOT_FOUND);
  });

  it('fetch with range', async () => {
    const result = await fetchHelper.fetchWithRange('https://developer.mozilla.org/en-US/docs/Web/API/Range');
    expect(result.httpStatus).toEqual(HTTP_STATUS.PARTIAL_CONTENT);
    expect((new TextEncoder()).encode(result.html).length).toBeLessThan(32000);
  });

  it('fetch with range and timeout', async () => {
    const result = await fetchHelper.fetchWithRange('https://jsonplaceholder.typicode.com/posts/1', 10000, 1);
    expect(result.httpStatus).toEqual(HTTP_STATUS.REQUEST_TIMEOUT);
    expect(result.html).toBeNull();
  });

  it('fetch with range (http range is not supported)', async () => {
    const result = await fetchHelper.fetchWithRange('https:reddit.com');
    expect(result.httpStatus).toEqual(HTTP_STATUS.OK);
    expect((new TextEncoder()).encode(result.html).length).toBeGreaterThan(32000);
  });

  it('fetch with stream and empty response', async () => {
    const result = await fetchHelper.fetchWithStream('https://jsonplaceholder.typicode.com/posts/1');
    expect(result.httpStatus).toEqual(HTTP_STATUS.OK);
    expect(result.html).toBeNull();
  });

  it('fetch with stream', async () => {
    const result = await fetchHelper.fetchWithStream('https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream');
    expect(result.httpStatus).toEqual(HTTP_STATUS.OK);
    expect(result.html).toBeTypeOf('string');
  });

  it('fet with stream adn timeout', async () => {
    const result = await fetchHelper.fetchWithStream('https://jsonplaceholder.typicode.com/posts/1', 1);
    expect(result.httpStatus).toEqual(HTTP_STATUS.REQUEST_TIMEOUT);
    expect(result.html).toBeNull();
  });
});
