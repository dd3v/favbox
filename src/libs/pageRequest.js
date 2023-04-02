export default class PageRequest {
  #url;

  constructor(url) {
    this.#url = url;
  }

  async getData() {
    const response = await fetch(this.#url);
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
  }
}
