export default class PageRequest {
  #url;

  constructor(url) {
    this.#url = url;
  }

  async getData() {
    const response = await fetch(this.#url);
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }
    const text = await response.text();
    return {
      text,
      contentType: response.headers.get('Content-Type'),
    };
  }
}
