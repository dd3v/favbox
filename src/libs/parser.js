export default class Parser {
  #html;

  #url;

  constructor(url, html) {
    this.#url = url;
    this.#html = html;
  }

  getTitle() {
    const meta = this.#html.querySelector('meta[property="og:title"]')
      ?? this.#html.querySelector('meta[name="twitter:title"]');
    const title = meta?.getAttribute('content');
    if (title) return title;
    const documentTitle = this.#html?.title;
    if (documentTitle) return documentTitle;
    const heading = this.#html.querySelector('h1') ?? this.#html.querySelector('h2');
    const headingTitle = heading?.textContent;
    if (headingTitle) return headingTitle;
    return null;
  }

  getDescription() {
    const meta = this.#html.querySelector('meta[property="og:description"]')
      ?? this.#html.querySelector('meta[name="twitter:description"]');
    const description = meta?.getAttribute('content');
    if (description) return description;
    const metaDescription = this.#html
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');
    if (metaDescription) return metaDescription;

    return null;
  }

  getImage() {
    const meta = this.#html.querySelector('meta[property="og:image"]')
      ?? this.#html.querySelector('meta[name="twitter:image"]');
    const image = meta?.getAttribute('content');
    if (image) return image;
    const linkImage = this.#html.querySelector('link[rel="image_src"]')?.getAttribute('href');
    if (linkImage) return linkImage;
    return null;
  }

  getDomain() {
    return new URL(this.#url).hostname;
  }

  getFavicon() {
    const link = this.#html.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')
      ?? this.#html.querySelector('link[rel="icon"]')?.getAttribute('href');
    if (link) {
      return new URL(link, this.#url).href ?? null;
    }
    return null;
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
