const fetchHelper = {

  UNKNOWN_ERROR: 520,
  REQUEST_TIMEOUT: 408,

  /**
  * A helper for making HTTP requests with a timeout.
  *
  * @param {string} url - The URL to fetch.
  * @param {number} [timeout=20000] - The timeout in milliseconds before aborting the request. Defaults to 20000ms..
  *
  * @returns {Promise<Object>} The result of the fetch request.
  * @returns {string|null} return.html - The HTML content of the response if successful, or `null` if an error occurred.
  * @returns {number} return.status -  HTTP status code.
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
};
export default fetchHelper;
