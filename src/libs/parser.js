export default class Parser {
  #html;

  #url;

  constructor(url, html) {
    this.#url = url;
    this.#html = html;
  }

  getTitle() {
    const title = this.#html
      .querySelector('meta[property="og:title"], meta[name="twitter:title"]')
      ?.getAttribute('content')
      ?? this.#html.title
      ?? this.#html.querySelector('h1')?.textContent
      ?? this.#html.querySelector('h2')?.textContent;

    return title || null;
  }

  getDescription() {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ];
    return this.#html.querySelector(selectors.join(','))?.getAttribute('content') ?? null;
  }

  getImage() {
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[property="og:image:url"]',
      'link[rel="image_src"]',
      'meta[property="forem:logo"]',
    ];
    let image = this.#html.querySelector(selectors.join(','));
    image = (image?.getAttribute('content') || image?.getAttribute('href')) ?? this.getAppleTouchIcon();
    return image ? new URL(image, this.#url).href : null;
  }

  getAppleTouchIcon() {
    let maxSize = 0;
    let maxIcon = null;
    const icons = this.#html.querySelectorAll('link[rel="apple-touch-icon"]');
    // eslint-disable-next-line no-restricted-syntax
    for (const icon of icons) {
      const size = parseInt(icon.getAttribute('sizes').split('x')[0], 10);
      if (size > maxSize) {
        maxSize = size;
        maxIcon = icon;
      }
    }
    return maxIcon ?? null;
  }

  getDomain() {
    return new URL(this.#url).hostname;
  }

  getFavicon() {
    const selectors = ['link[rel="shortcut icon"]', 'link[rel="icon"]'];
    const link = this.#html.querySelector(selectors.join(','))?.getAttribute('href');
    return link ? new URL(link, this.#url).href : null;
  }

  getUrl() {
    return this.#url;
  }

  getFullPageInfo() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      image: this.getImage(),
      domain: this.getDomain(),
      favicon: this.getFavicon(),
      url: this.getUrl(),
    };
  }
}
