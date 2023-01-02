export default class Parser {
  #html;

  constructor(html) {
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
    // TODO: what if try to find?
    return null;
  }

  getDomain() {
    const link = this.#html.querySelector('link[ref="canonical"]')?.getAttribute('href');
    if (link) return link;
    const ogLink = this.#html.querySelector('meta[property="og:url"]')?.getAttribute('content');
    if (ogLink) return ogLink;
    const windowLocation = this.#html.location.hostname;
    if (windowLocation) return windowLocation;
    return null;
  }
}
