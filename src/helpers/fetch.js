const fetchHelper = {
  /**
   * A helper for making HTTP requests with a timeout.
   *
   * @param {string} url - The URL to fetch.
   * @param {number} [timeout=5000] - The timeout in milliseconds before aborting the request. Defaults to 5000ms.
   *
   * @returns {Promise<Object>} The result of the fetch request.
   * @returns {string|null} return.html - The HTML content of the response if successful, or `null` if an error occurred.
   * @returns {number} return.error - Error code representing the status of the request. `0` for success, HTTP status code for errors (e.g., `404`, `500`).
   */
  fetch: async (url, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      const text = await response.text();
      return {
        html: response.ok ? text : null,
        error: response.ok ? 0 : response.status,
      };
    } catch (e) {
      console.error('HTTP error', e);
      const errorCode = e.name === 'AbortError' ? 408 : 520;
      return {
        error: errorCode,
        html: null,
      };
    } finally {
      clearTimeout(id);
    }
  },
};
export default fetchHelper;
