import { HTTP_STATUS } from '@/constants/httpStatus';

/**
 * Makes an HTTP GET request with a timeout.
 * @param {string} url - The URL to fetch.
 * @param {number} [timeout] - Timeout in milliseconds (default: 20000).
 * @returns {Promise<{html: string|null, httpStatus: number}>}
 */
export async function fetchUrl(url, timeout = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal,
    });
    const text = await response.text();
    return {
      html: response.ok ? text : null,
      httpStatus: response.status,
    };
  } catch (e) {
    const errorCode = e.name === 'AbortError' ? HTTP_STATUS.REQUEST_TIMEOUT : HTTP_STATUS.UNKNOWN_ERROR;
    return {
      httpStatus: errorCode,
      html: null,
    };
  } finally {
    clearTimeout(id);
  }
}

/**
 * Makes a HEAD HTTP request with a timeout.
 * @param {string} url - The URL to make HEAD request to.
 * @param {number} [timeout] - Timeout in milliseconds (default: 20000).
 * @returns {Promise<number>} The HTTP status code or error code (REQUEST_TIMEOUT, UNKNOWN_ERROR).
 */
export async function fetchHead(url, timeout = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal,
    });
    return response.status;
  } catch (e) {
    const errorCode = e.name === 'AbortError' ? HTTP_STATUS.REQUEST_TIMEOUT : HTTP_STATUS.UNKNOWN_ERROR;
    return errorCode;
  } finally {
    clearTimeout(id);
  }
}
