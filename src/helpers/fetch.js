import { HTTP_STATUS } from './httpStatus';

const fetchHelper = {

  UNKNOWN_ERROR: 520,
  REQUEST_TIMEOUT: 408,

  /**
  * A helper for making HTTP requests with a timeout.
  *
  * @param {string} url - The URL to fetch.
  * @param {number} [timeout=20000] - The timeout in milliseconds before aborting the request. Defaults to 20000ms.
  *
  * @returns {Promise<Object>} The result of the fetch request.
  * @returns {string|null} return.html - The HTML content of the response if successful, or `null` if an error occurred.
  * @returns {number} return.httpStatus - HTTP status code or error code (REQUEST_TIMEOUT, UNKNOWN_ERROR).
 */
  fetch: async (url, timeout = 20000) => {
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
      const errorCode = e.name === 'AbortError' ? fetchHelper.REQUEST_TIMEOUT : fetchHelper.UNKNOWN_ERROR;
      return {
        httpStatus: errorCode,
        html: null,
      };
    } finally {
      clearTimeout(id);
    }
  },

  /**
 * Checks the internet connection.
 *
 * @returns {Promise<boolean>} Returns `true` if the server's response is successful; otherwise, returns `false`.
 */
  ping: async () => {
    try {
      const response = await fetch('https://clients3.google.com/generate_204', {
        method: 'HEAD',
      });
      return response && response.ok;
    } catch (error) {
      return false;
    }
  },

  /**
  * A helper for making HEAD HTTP requests with a timeout.
  *
  * @param {string} url - The URL to make HEAD request to.
  * @param {number} [timeout=20000] - The timeout in milliseconds before aborting the request. Defaults to 20000ms.
  *
  * @returns {Promise<number>} The HTTP status code or error code (REQUEST_TIMEOUT, UNKNOWN_ERROR).
 */
  head: async (url, timeout = 20000) => {
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
      const errorCode = e.name === 'AbortError' ? fetchHelper.REQUEST_TIMEOUT : fetchHelper.UNKNOWN_ERROR;
      return errorCode;
    } finally {
      clearTimeout(id);
    }
  },

  /**
  * A helper for making HTTP requests with a timeout and range headers.
  *
  * @param {string} url - The URL to fetch.
  * @param {number} [rangeSize=32000] - The range size in bytes for partial content requests. Defaults to 32000 bytes.
  * @param {number} [timeout=20000] - The timeout in milliseconds before aborting the request. Defaults to 20000ms.
  *
  * @returns {Promise<Object>} The result of the fetch request.
  * @returns {string|null} return.html - The HTML content of the response (full content or head section for partial content) if successful, or `null` if an error occurred.
  * @returns {number|string} return.httpStatus - HTTP status code or error code (REQUEST_TIMEOUT, UNKNOWN_ERROR).
 */
  fetchWithRange: async (url, rangeSize = 32000, timeout = 20000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        headers: { Range: `bytes=0-${rangeSize}` },
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        signal: controller.signal,
      });
      const text = await response.text();
      if (response.status === 206) {
        return {
          html: text.match(/<head[^>]*>[\s\S]*?<\/head>/)?.[0] || null,
          httpStatus: response.status,
        };
      }
      return {
        html: text,
        httpStatus: response.status,
      };
    } catch (e) {
      const errorCode = e.name === 'AbortError' ? fetchHelper.REQUEST_TIMEOUT : fetchHelper.UNKNOWN_ERROR;
      return {
        html: null,
        httpStatus: errorCode,
      };
    } finally {
      clearTimeout(id);
    }
  },

  /**
  * A helper for making HTTP requests with a timeout and stream reading.
  * Reads the response stream until the </head> tag is found and returns only the head section.
  *
  * @param {string} url - The URL to fetch.
  * @param {number} [timeout=20000] - The timeout in milliseconds before aborting the request. Defaults to 20000ms.
  *
  * @returns {Promise<Object>} The result of the fetch request.
  * @returns {string|null} return.html - The head section of the HTML if found, or `null` if not found or an error occurred.
  * @returns {number|string} return.httpStatus - HTTP status code, error code (REQUEST_TIMEOUT, UNKNOWN_ERROR), or NOT_IMPLEMENTED status.
 */
  fetchWithStream: async (url, timeout = 20000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        signal: controller.signal,
      });
      if (!response.body || !response.body.getReader) {
        return { httpStatus: HTTP_STATUS.NOT_IMPLEMENTED, html: null };
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        const headEndIndex = result.indexOf('</head>');
        if (headEndIndex !== -1) {
          result = result.substring(0, headEndIndex + 7);
          reader.cancel();
          return {
            httpStatus: response.status,
            html: result.match(/<head[^>]*>[\s\S]*?<\/head>/)?.[0] || null,
          };
        }
      }
      return { httpStatus: response.status, html: null };
    } catch (e) {
      const errorCode = e.name === 'AbortError' ? fetchHelper.REQUEST_TIMEOUT : fetchHelper.UNKNOWN_ERROR;
      return {
        html: null,
        httpStatus: errorCode,
      };
    } finally { clearTimeout(id); }
  },
};

export default fetchHelper;
