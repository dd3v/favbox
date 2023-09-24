export default class PageRequest {
  #url;

  #timeout;

  constructor(url, timeout) {
    this.#url = url;
    this.#timeout = timeout;
  }

  async getData() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.#timeout);
      const response = await fetch(this.#url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) {
        const error = new Error(`An error has occurred: ${response.status}`);
        error.code = response.status;
        throw error;
      }

      const text = await response.text();
      return {
        text,
        contentType: response.headers.get('Content-Type'),
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}
